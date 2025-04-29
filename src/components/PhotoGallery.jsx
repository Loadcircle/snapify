'use client';

import { useState, useEffect } from 'react';

export default function PhotoGallery({ eventId }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/photos?eventId=${eventId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setError('Failed to load photos. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPhotos();
  }, [eventId]);
  
  const refreshGallery = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/photos?eventId=${eventId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error refreshing photos:', error);
      setError('Failed to refresh photos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };
  
  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading photos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-500">
        {error}
        <button 
          onClick={refreshGallery}
          className="ml-4 underline text-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }
  
  if (photos.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-gray-500 mb-2">No photos yet</p>
        <p className="text-sm text-gray-400">Be the first to add a photo to this event!</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map(photo => (
          <div 
            key={photo.id} 
            className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openPhotoModal(photo)}
          >
            <div className="relative aspect-[4/3]">
              <img 
                src={photo.url} 
                alt={`Photo by ${photo.creator}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-500">
                By: {photo.creator}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(photo.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={refreshGallery}
        className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Refresh Gallery
      </button>
      
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closePhotoModal}>
          <div className="max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={selectedPhoto.url} 
                alt={`Photo by ${selectedPhoto.creator}`} 
                className="max-h-[70vh] w-auto mx-auto"
              />
              <button 
                className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                onClick={closePhotoModal}
              >
                &times;
              </button>
            </div>
            <div className="p-4 bg-white">
              <p className="font-medium">
                Uploaded by {selectedPhoto.creator}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(selectedPhoto.createdAt).toLocaleString()}
              </p>
              <a 
                href={selectedPhoto.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download Original
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 