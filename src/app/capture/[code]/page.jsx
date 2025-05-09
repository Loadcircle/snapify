'use client';

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

// Define filter presets
const FILTERS = {
  none: { name: 'Normal', css: '' },
  sepia: { name: 'Vintage', css: 'sepia(0.7)' },
  grayscale: { name: 'B&N', css: 'grayscale(1)' },
  contrast: { name: 'Vívido', css: 'contrast(1.5) saturate(1.5)' },
  warm: { name: 'Cálido', css: 'sepia(0.3) saturate(1.6) hue-rotate(-15deg)' },
};

export default function CapturePhotoPage({ params }) {
  const resolvedParams = use(params);
  const code = resolvedParams.code;
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [creator, setCreator] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [stream, setStream] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [creatorNameSet, setCreatorNameSet] = useState(false);
  const [devicePhotos, setDevicePhotos] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [allowedFilters, setAllowedFilters] = useState(['none']);
  
  const videoRef = useRef();
  const canvasRef = useRef();
  
  // Initialize device ID on component mount
  useEffect(() => {
    const initializeDeviceId = async () => {
      // Try to get existing device ID from localStorage
      let storedDeviceId = localStorage.getItem('snapify_device_id');
      
      // If not found, generate a new one
      if (!storedDeviceId) {
        storedDeviceId = uuidv4();
        localStorage.setItem('snapify_device_id', storedDeviceId);
      }
      
      setDeviceId(storedDeviceId);
      
      // Also try to get previously used creator name
      const storedCreator = localStorage.getItem('snapify_creator_name');
      if (storedCreator) {
        setCreator(storedCreator);
        setCreatorNameSet(true);
      }
    };
    
    initializeDeviceId();
  }, []);
  
  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/${code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Evento no encontrado. Por favor verifica el código e inténtalo de nuevo.');
          }
          throw new Error('Error al cargar el evento. Por favor inténtalo de nuevo.');
        }
        
        const data = await response.json();
        setEvent(data);
        
        // Set allowed filters based on event configuration
        if (data.allowedFilters) {
          const filterIds = data.allowedFilters.split(',');
          setAllowedFilters(filterIds);
          
          // If only one filter is allowed, automatically set it as current
          if (filterIds.length === 1) {
            setCurrentFilter(filterIds[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error.message || 'Error al cargar el evento. Por favor inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [code]);
  
  // Fetch photos by this device for this event
  useEffect(() => {
    const fetchDevicePhotos = async () => {
      if (event && deviceId) {
        try {
          const response = await fetch(`/api/photos?eventId=${event.id}&deviceId=${deviceId}`);
          
          if (!response.ok) {
            console.error('Failed to fetch device photos');
            return;
          }
          
          const photos = await response.json();
          setDevicePhotos(photos);
        } catch (error) {
          console.error('Error fetching device photos:', error);
        }
      }
    };
    
    fetchDevicePhotos();
    
    // Set up polling to refresh photos periodically
    const intervalId = setInterval(fetchDevicePhotos, 10000); // Every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [event, deviceId, uploadSuccess]);
  
  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  
  const submitCreatorName = () => {
    if (creator.trim()) {
      localStorage.setItem('snapify_creator_name', creator);
      setCreatorNameSet(true);
      startCamera();
    } else {
      toast.error('Por favor ingresa tu nombre');
    }
  };
  
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
      toast.error(`Could not access your camera. ${error.message || 'Please check permissions.'}`);
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
    
    // First draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply the selected filter to the canvas if not "none"
    if (currentFilter !== 'none') {
      // iOS Safari doesn't support canvas filter property well
      // Create a temporary image element to apply the filter for iOS compatibility
      const tempImg = document.createElement('img');
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      // Set dimensions of temp canvas
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      // Get the data URL from the original canvas
      const originalDataURL = canvas.toDataURL('image/jpeg', 1.0);
      
      // Apply filter manually with a temp image and temp canvas
      tempImg.onload = () => {
        // Draw the original image to the temp canvas
        tempCtx.drawImage(tempImg, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Apply filter manually based on the selected filter
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const pixels = imageData.data;
        
        // Apply the filter manually to the pixel data
        switch(currentFilter) {
          case 'sepia':
            applySepia(pixels);
            break;
          case 'grayscale':
            applyGrayscale(pixels);
            break;
          case 'contrast':
            applyContrast(pixels);
            break;
          case 'warm':
            applyWarm(pixels);
            break;
        }
        
        // Put the modified pixel data back to the temp canvas
        tempCtx.putImageData(imageData, 0, 0);
        
        // Get the filtered image data URL
        const filteredDataURL = tempCanvas.toDataURL('image/jpeg', 0.9);
        
        // Set the filtered image as the photo data
        setPhotoData(filteredDataURL);
        setPhotoTaken(true);
        
        // Stop the camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      };
      
      // Set the source of the temp image to trigger onload
      tempImg.src = originalDataURL;
    } else {
      // No filter, use original canvas data
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setPhotoData(imageData);
      setPhotoTaken(true);
      
      // Stop the camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };
  
  // Filter functions for manually applying filters
  const applySepia = (pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      pixels[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      pixels[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      pixels[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
  };
  
  const applyGrayscale = (pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Standard grayscale conversion
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      
      pixels[i] = gray;
      pixels[i + 1] = gray;
      pixels[i + 2] = gray;
    }
  };
  
  const applyContrast = (pixels) => {
    const factor = 1.5; // Contrast factor
    const saturationFactor = 1.5; // Saturation factor
    
    for (let i = 0; i < pixels.length; i += 4) {
      // Apply contrast
      pixels[i] = Math.min(255, ((pixels[i] - 128) * factor) + 128);
      pixels[i + 1] = Math.min(255, ((pixels[i + 1] - 128) * factor) + 128);
      pixels[i + 2] = Math.min(255, ((pixels[i + 2] - 128) * factor) + 128);
      
      // Apply saturation (using simple RGB to HSL and back conversion)
      const r = pixels[i] / 255;
      const g = pixels[i + 1] / 255;
      const b = pixels[i + 2] / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
      }
      
      // Increase saturation
      s = Math.min(1, s * saturationFactor);
      
      // Convert back to RGB
      if (s === 0) {
        pixels[i] = pixels[i + 1] = pixels[i + 2] = l * 255;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        pixels[i] = hue2rgb(p, q, h + 1/3) * 255;
        pixels[i + 1] = hue2rgb(p, q, h) * 255;
        pixels[i + 2] = hue2rgb(p, q, h - 1/3) * 255;
      }
    }
  };
  
  const applyWarm = (pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      // Apply sepia with a lower intensity
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      pixels[i] = Math.min(255, (r * 0.9) + (g * 0.1) + (b * 0.1));  // Increase red
      pixels[i + 1] = Math.min(255, (r * 0.1) + (g * 0.9) + (b * 0.1));  // Keep green
      pixels[i + 2] = Math.min(255, (r * 0.1) + (g * 0.2) + (b * 0.7));  // Reduce blue slightly
    }
  };
  
  // Helper function for HSL to RGB conversion
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const retakePhoto = () => {
    setPhotoTaken(false);
    setPhotoData(null);
    startCamera();
  };
  
  const changeFilter = (filterId) => {
    setCurrentFilter(filterId);
  };
  
  const uploadPhoto = async () => {
    if (!photoData || !creator.trim() || !deviceId) return;
    
    // Save creator name for future use
    localStorage.setItem('snapify_creator_name', creator);
    
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
      formData.append('deviceId', deviceId);
      
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
          deviceId,
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
        setUploadProgress(0);
        setUploadSuccess(false);
        startCamera();
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError(error.message || 'Failed to upload photo. Please try again.');
      setUploadProgress(0);
      toast.error(error.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };
  
  const viewPhoto = (photo) => {
    setFullscreenPhoto(photo);
  };
  
  const closePhotoView = () => {
    setFullscreenPhoto(null);
  };
  
  if (isLoading) {
    return (
      <div className="h-[100vh] max-h-[100vh] overflow-hidden bg-gray-900 flex justify-center items-center p-4">
        <div className="animate-pulse text-white text-xl">Cargando...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-[100vh] max-h-[100vh] overflow-hidden bg-gray-900 flex justify-center items-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-white mb-6">{error}</p>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Volver al Inicio
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
      <div className="h-[100vh] max-h-[100vh] overflow-hidden bg-gray-900 flex justify-center items-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">Evento Expirado</h1>
          <p className="text-white mb-6">Este evento ha expirado y ya no acepta fotos.</p>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }
  
  if (isMaxPhotosReached) {
    return (
      <div className="h-[100vh] max-h-[100vh] overflow-hidden bg-gray-900 flex justify-center items-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">Límite de Fotos Alcanzado</h1>
          <p className="text-white mb-6">Este evento ha alcanzado su límite máximo de fotos.</p>
          <Link href={`/events/${code}`} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Ver Galería del Evento
          </Link>
        </div>
      </div>
    );
  }
  
  // Creator name input view
  if (!creatorNameSet) {
    return (
      <div className="h-[100vh] max-h-[100vh] overflow-hidden bg-black flex justify-center items-center p-4">
        <div className="p-6 rounded-lg max-w-md w-full bg-black">
          <h1 className="text-xl font-bold text-white mb-4 text-center">{event.title}</h1>
          <p className="text-white mb-6 text-center">¿Cuál es tu nombre?</p>
          
          <div className="space-y-4">
            <input
              type="text"
              id="creator"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              required
              className="w-full p-3 border rounded-lg bg-gray-900 text-white border-gray-700"
              placeholder="Ingresa tu nombre"
            />
            
            <button
              onClick={submitCreatorName}
              disabled={!creator.trim()}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg disabled:bg-blue-800 disabled:opacity-50"
            >
              Continuar a la Cámara
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Fullscreen photo view
  if (fullscreenPhoto) {
    return (
      <div className="fixed inset-0 h-[100vh] max-h-[100vh] overflow-hidden bg-black z-50 flex flex-col">
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
          <button onClick={closePhotoView} className="text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-white text-sm">
            <span>{fullscreenPhoto.creator}</span>
          </div>
          <div className="w-10"></div> {/* Empty div for flex alignment */}
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <img 
            src={fullscreenPhoto.url} 
            alt={`Photo by ${fullscreenPhoto.creator}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    );
  }
  
  // Gallery view
  if (showGallery) {
    return (
      <div className="h-[100vh] max-h-[100vh] overflow-hidden bg-black flex flex-col">
        {/* Gallery header - made smaller and more subtle */}
        <div className="bg-black p-3 text-white border-b border-gray-800">
          <div className="mx-auto flex justify-between items-center">
            <button onClick={toggleGallery} className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Camera</span>
            </button>
            <h1 className="text-sm font-medium">{event.title}</h1>
            <Link href={`/events/${code}`} className="text-sm text-blue-400">
              Galería
            </Link>
          </div>
        </div>
        
        {/* Gallery content */}
        <div className="flex-1 p-2 w-full">
          <h2 className="text-white text-sm mb-2 px-2">Tus Fotos ({devicePhotos.length})</h2>
          
          {devicePhotos.length === 0 ? (
            <div className="text-center text-white p-8">
              <p>Aún no has tomado ninguna foto.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {devicePhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="aspect-square relative overflow-hidden cursor-pointer"
                  onClick={() => viewPhoto(photo)}
                >
                  <img 
                    src={photo.url} 
                    alt={`Photo by ${photo.creator}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Camera view
  return (
    <div className="h-[100vh] max-h-[100vh] overflow-hidden bg-black flex flex-col">
      {/* Main content - removed the header for fullscreen camera experience */}
      <div className="flex-1 flex flex-col w-full relative h-full">
        {!photoTaken ? (
          <>
            {/* Camera view - made full width/height with no padding */}
            <div className="relative w-full h-full bg-black flex-1">
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-white mb-4">Se requiere acceso a la cámara</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Iniciar Cámara
                  </button>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${stream ? 'block' : 'hidden'}`}
                style={{ filter: FILTERS[currentFilter].css }}
              />
            </div>
            
            {/* Floating controls overlay at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              {/* Mini icons for navigation */}
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={toggleGallery} 
                  className="p-2 rounded-full bg-black/50 backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <Link href={`/events/${code}`} className="p-2 rounded-full bg-black/50 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>
              
              {/* Filter selection - only show if allowed filters has more than 1 option */}
              {stream && allowedFilters.length > 1 && (
                <div className="mb-4">
                  <div className="flex justify-center space-x-2 overflow-x-auto py-2">
                    {allowedFilters.map((filterId) => (
                      <button
                        key={filterId}
                        onClick={() => changeFilter(filterId)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          currentFilter === filterId
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        {FILTERS[filterId].name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected filter indicator when only one is allowed */}
              {stream && allowedFilters.length === 1 && allowedFilters[0] !== 'none' && (
                <div className="text-center text-white text-sm mb-4">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md inline-block">
                    Filter: {FILTERS[allowedFilters[0]].name}
                  </span>
                </div>
              )}
              
              {/* Camera controls */}
              {stream && (
                <button
                  onClick={takePhoto}
                  className="mx-auto w-18 h-18 rounded-full bg-white flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-gray-800"></div>
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Photo preview - made full width/height */}
            <div className="w-full h-full bg-black flex-1">
              <img
                src={photoData}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Controls as overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              {!isUploading && !uploadSuccess && (
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={retakePhoto}
                    className="px-6 py-3 bg-gray-800/80 backdrop-blur-sm text-white rounded-full"
                  >
                    Retake
                  </button>
                  <button
                    onClick={uploadPhoto}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full"
                  >
                    Upload
                  </button>
                </div>
              )}
              
              {isUploading && (
                <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg">
                  <div className="h-2 w-full bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-2 text-white">
                    Subiendo... {uploadProgress}%
                  </p>
                </div>
              )}
              
              {uploadSuccess && (
                <div className="bg-green-900/70 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="text-green-400 text-xl mb-2">✓</div>
                  <p className="text-white">¡Foto subida exitosamente!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 