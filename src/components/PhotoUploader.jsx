'use client';

import { useState } from 'react';

export default function PhotoUploader({ eventId, eventCode, onPhotoUploaded }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [creator, setCreator] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.includes('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }
    
    if (!creator.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setIsUploading(true);
    setError('');
    setUploadProgress(10);
    
    try {
      // Create form data for the upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('eventCode', eventCode);
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
          eventId,
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
      
      const photo = await response.json();
      setUploadProgress(100);
      
      // Reset form
      setSelectedFile(null);
      setPreview('');
      setCreator('');
      setUploadProgress(0);
      
      // Notify parent component
      if (onPhotoUploaded) {
        onPhotoUploaded(photo);
      }
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError(error.message || 'Failed to upload photo. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-500">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="creator" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="creator"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            required
            disabled={isUploading}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="photo" className="block text-sm font-medium mb-1">
            Select Photo
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="w-full p-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Max file size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
        
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Preview</p>
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-48 max-w-full object-contain rounded-md"
            />
          </div>
        )}
        
        {isUploading && (
          <div className="mt-4">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1 text-gray-500">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading || !selectedFile || !creator.trim()}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
} 