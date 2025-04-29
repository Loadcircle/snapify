'use client';

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CapturePhotoPage({ params }) {
  const resolvedParams = use(params);
  const code = resolvedParams.code;
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [creator, setCreator] = useState('');
  const [stream, setStream] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const videoRef = useRef();
  const canvasRef = useRef();
  
  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/${code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Event not found. Please check the code and try again.');
          }
          throw new Error('Failed to load event. Please try again.');
        }
        
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error.message || 'Failed to load event. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [code]);
  
  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  
  const startCamera = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in your browser. Please try using a modern browser.');
      }
      
      // Request camera access with preferred settings for mobile
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use the back camera by default
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      
      // Set the video source to the camera stream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError(`Error accessing camera: ${error.message || 'Please check camera permissions'}`);
      
      // Show user-friendly error
      toast({
        title: "Camera Error",
        description: `Could not access your camera. ${error.message || 'Please check permissions.'}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setPhotoData(imageData);
    setPhotoTaken(true);
    
    // Stop the camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  
  const retakePhoto = () => {
    setPhotoTaken(false);
    setPhotoData(null);
    startCamera();
  };
  
  const uploadPhoto = async () => {
    if (!photoData || !creator.trim()) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Create a Blob from the base64 data
      const base64Data = photoData.split(',')[1];
      const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
      
      // Create a File object from the Blob
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Create form data for the upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('eventCode', code);
      formData.append('creator', creator);
      
      setUploadProgress(25);
      
      // Upload the image to our API which will handle Cloudinary upload
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress(75);
      
      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || 'Failed to upload image');
      }
      
      const uploadResult = await uploadResponse.json();
      
      setUploadProgress(90);
      
      // Create the photo record in the database
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: uploadResult.eventId,
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          width: uploadResult.width,
          height: uploadResult.height,
          creator,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create photo record');
      }
      
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Reset for another photo
      setTimeout(() => {
        setPhotoTaken(false);
        setPhotoData(null);
        setCreator('');
        setUploadProgress(0);
        setUploadSuccess(false);
        startCamera();
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError(error.message || 'Failed to upload photo. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-white mb-6">{error}</p>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return null;
  }
  
  // Check if event has expired
  const isExpired = new Date(event.expiresAt) < new Date();
  
  // Check if event has reached max photos
  const isMaxPhotosReached = event.usedPhotos >= event.maxPhotos;
  
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">Event Expired</h1>
          <p className="text-white mb-6">This event has expired and is no longer accepting photos.</p>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (isMaxPhotosReached) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">Maximum Photos Reached</h1>
          <p className="text-white mb-6">This event has reached its maximum photo limit.</p>
          <Link href={`/events/${code}`} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            View Event Gallery
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 text-white">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{event.title}</h1>
          <Link href={`/events/${code}`} className="text-sm text-blue-400">
            View Gallery
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        {!photoTaken ? (
          <>
            {/* Camera view */}
            <div className="relative aspect-[3/4] w-full bg-black rounded-lg overflow-hidden mb-4">
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-white mb-4">Camera access required</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Start Camera
                  </button>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${stream ? 'block' : 'hidden'}`}
              />
            </div>
            
            {/* Camera controls */}
            {stream && (
              <button
                onClick={takePhoto}
                className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4"
              >
                <div className="w-14 h-14 rounded-full border-4 border-gray-800"></div>
              </button>
            )}
          </>
        ) : (
          <>
            {/* Photo preview */}
            <div className="relative aspect-[3/4] w-full bg-black rounded-lg overflow-hidden mb-4">
              <img
                src={photoData}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
            </div>
            
            {!isUploading && !uploadSuccess && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="creator" className="block text-sm font-medium text-white mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="creator"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md bg-gray-800 text-white border-gray-600"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={retakePhoto}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md"
                  >
                    Retake
                  </button>
                  <button
                    onClick={uploadPhoto}
                    disabled={!creator.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-800 disabled:opacity-50"
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        {isUploading && (
          <div className="mt-4 bg-gray-800 p-4 rounded-lg">
            <div className="h-2 w-full bg-gray-700 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-2 text-white">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="mt-4 bg-green-900 p-4 rounded-lg text-center">
            <div className="text-green-400 text-xl mb-2">✓</div>
            <p className="text-white">Photo uploaded successfully!</p>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 