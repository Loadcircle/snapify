'use client';

import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function PhotoGallery({ eventId, isAdminView = false }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
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
  
  const downloadSinglePhoto = async (photo) => {
    try {
      const response = await fetch(photo.url);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      
      // Extract file extension or default to .jpg
      const urlParts = photo.url.split('.');
      const extension = urlParts.length > 1 ? `.${urlParts.pop().split('?')[0]}` : '.jpg';
      
      const fileName = `photo_by_${photo.creator.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${extension}`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading photo:', error);
      alert('Failed to download this photo. Please try again.');
    }
  };
  
  const downloadAllPhotos = async () => {
    if (photos.length === 0) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      const zip = new JSZip();
      let downloaded = 0;
      
      // Create a folder in the zip
      const photosFolder = zip.folder("event-photos");
      
      // Download each photo and add to zip
      const photoPromises = photos.map(async (photo, index) => {
        try {
          // Fetch the image
          const response = await fetch(photo.url);
          if (!response.ok) throw new Error(`Failed to fetch image ${index + 1}`);
          
          const blob = await response.blob();
          
          // Extract the file extension from the URL or default to .jpg
          let fileName = `photo_${index + 1}_by_${photo.creator.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
          
          // Try to get file extension from the URL
          const urlParts = photo.url.split('.');
          const extension = urlParts.length > 1 ? `.${urlParts.pop().split('?')[0]}` : '.jpg';
          
          fileName += extension;
          
          // Add to zip
          photosFolder.file(fileName, blob);
          
          // Update progress
          downloaded++;
          setDownloadProgress(Math.round((downloaded / photos.length) * 100));
          
        } catch (err) {
          console.error(`Error downloading photo ${index + 1}:`, err);
          // Continue with other photos even if one fails
        }
      });
      
      // Wait for all photos to be downloaded and added to the zip
      await Promise.all(photoPromises);
      
      // Generate the zip file
      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 5
        }
      }, (metadata) => {
        setDownloadProgress(Math.round(metadata.percent));
      });
      
      // Save the zip file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      saveAs(content, `event-photos-${timestamp}.zip`);
      
    } catch (error) {
      console.error('Error downloading all photos:', error);
      alert('Failed to download all photos. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-orange-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Cargando fotos...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-100 flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H8m16 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={refreshGallery}
            className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }
  
  if (photos.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-gray-50">
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay fotos todavía</h3>
          <p className="text-gray-500 mb-4">¡Sé el primero en añadir una foto a este evento!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Admin controls */}
      {isAdminView && (
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-4 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700">Total de fotos: <span className="text-orange-600">{photos.length}</span></h3>
          </div>
          
          <button
            onClick={downloadAllPhotos}
            disabled={isDownloading || photos.length === 0}
            className="btn btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isDownloading ? `Descargando (${downloadProgress}%)` : 'Descargar todas las fotos'}
          </button>
        </div>
      )}
      
      {/* Download progress bar */}
      {isDownloading && (
        <div className="mb-6 bg-gray-100 rounded-full overflow-hidden h-4">
          <div 
            className="h-full bg-green-500 transition-all duration-300 ease-in-out flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${downloadProgress}%` }}
          >
            {downloadProgress}%
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map(photo => (
          <div 
            key={photo.id} 
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div 
              className="relative aspect-square cursor-pointer overflow-hidden"
              onClick={() => openPhotoModal(photo)}
            >
              <img 
                src={photo.url} 
                alt={`Foto por ${photo.creator}`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-800 truncate">
                  {photo.creator}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadSinglePhoto(photo);
                  }}
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                  title="Descargar foto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(photo.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={refreshGallery}
          className="btn btn-secondary inline-flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar galería
        </button>
        
        {isAdminView && photos.length > 0 && (
          <button
            onClick={downloadAllPhotos}
            disabled={isDownloading}
            className="btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isDownloading ? `Descargando (${downloadProgress}%)` : 'Descargar todas las fotos'}
          </button>
        )}
      </div>
      
      {/* Photo modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closePhotoModal}
        >
          <div 
            className="max-w-4xl max-h-[90vh] w-full bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={closePhotoModal}
                  className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-black flex items-center justify-center max-h-[70vh]">
                <img 
                  src={selectedPhoto.url} 
                  alt={`Foto por ${selectedPhoto.creator}`} 
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>
              <div className="p-4 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{selectedPhoto.creator}</p>
                    <p className="text-sm text-gray-500">{new Date(selectedPhoto.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => downloadSinglePhoto(selectedPhoto)}
                    className="btn btn-primary inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 