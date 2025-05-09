'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function PublicGalleryPage({ params }) {
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const code = resolvedParams.code;
  
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [currentView, setCurrentView] = useState('grid'); // 'grid' or 'masonry'
  
  // Fetch event data
  useEffect(() => {
    const fetchEventAndPhotos = async () => {
      try {
        setIsLoading(true);
        
        // Fetch event details
        const eventResponse = await fetch(`/api/events/${code}`);
        
        if (!eventResponse.ok) {
          if (eventResponse.status === 404) {
            throw new Error('Evento no encontrado. Por favor verifica el código e intenta de nuevo.');
          }
          throw new Error('Error al cargar el evento. Por favor intenta de nuevo.');
        }
        
        const eventData = await eventResponse.json();
        setEvent(eventData);
        
        // Check if current user is the creator
        if (session?.user?.id && eventData.createdById === session.user.id) {
          setIsCreator(true);
        }
        
        // Fetch photos for this event
        const photosResponse = await fetch(`/api/photos?eventId=${eventData.id}`);
        
        if (!photosResponse.ok) {
          throw new Error('Error al obtener las fotos');
        }
        
        const photosData = await photosResponse.json();
        setPhotos(photosData);
      } catch (error) {
        console.error('Error al cargar la galería:', error);
        setError(error.message || 'Error al cargar la galería. Por favor intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventAndPhotos();
  }, [code, session]);
  
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closePhotoModal = () => {
    setSelectedPhoto(null);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };
  
  const navigateToNextPhoto = () => {
    if (!selectedPhoto) return;
    
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };
  
  const navigateToPreviousPhoto = () => {
    if (!selectedPhoto) return;
    
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const previousIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[previousIndex]);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      
      if (e.key === 'ArrowRight') {
        navigateToNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        navigateToPreviousPhoto();
      } else if (e.key === 'Escape') {
        closePhotoModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, photos]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-pulse text-white">Cargando galería...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-black p-8 flex justify-center items-center">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
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
  
  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-black p-8 flex justify-center items-center">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{event.title}</h1>
          <p className="text-white mb-6">Aún no hay fotos disponibles en esta galería.</p>
          <Link href={`/capture/${code}`} className="px-4 py-2 bg-orange-500 text-white rounded-md">
            Agregar Fotos
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          
          <div className="flex items-center space-x-4">
            {/* View toggle buttons */}
            <div className="flex rounded-md overflow-hidden border border-gray-700">
              <button
                onClick={() => setCurrentView('grid')}
                className={`px-3 py-1 ${currentView === 'grid' ? 'bg-orange-500' : 'bg-gray-800'}`}
              >
                Cuadrícula
              </button>
              <button
                onClick={() => setCurrentView('masonry')}
                className={`px-3 py-1 ${currentView === 'masonry' ? 'bg-orange-500' : 'bg-gray-800'}`}
              >
                Mosaico
              </button>
            </div>
            
            <Link href={`/capture/${code}`} className="text-sm bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded">
              Añadir Fotos
            </Link>
            
            {isCreator && (
              <Link href={`/events/${code}`} className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded">
                Panel Admin
              </Link>
            )}
          </div>
        </div>
      </header>
      
      {/* Main gallery content */}
      <main className="container mx-auto px-4 py-6">
        {currentView === 'grid' ? (
          // Grid view
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div 
                key={photo.id} 
                className="aspect-square cursor-pointer overflow-hidden rounded-lg group relative"
                onClick={() => openPhotoModal(photo)}
              >
                <img 
                  src={photo.url} 
                  alt={`Foto de ${photo.creator}`} 
                  className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium truncate">
                    {photo.creator}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Masonry view
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map(photo => (
              <div 
                key={photo.id} 
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg group relative"
                onClick={() => openPhotoModal(photo)}
              >
                <img 
                  src={photo.url} 
                  alt={`Foto de ${photo.creator}`} 
                  className="w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium truncate">
                    {photo.creator}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-black/80 border-t border-gray-800 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>La galería contiene {photos.length} fotos • Creada con Snapify</p>
        </div>
      </footer>
      
      {/* Photo modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closePhotoModal}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 z-10 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            onClick={closePhotoModal}
          >
            &times;
          </button>
          
          {/* Previous button */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              navigateToPreviousPhoto();
            }}
          >
            &#10094;
          </button>
          
          {/* Next button */}
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              navigateToNextPhoto();
            }}
          >
            &#10095;
          </button>
          
          {/* Photo container */}
          <div 
            className="max-w-7xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedPhoto.url} 
              alt={`Foto de ${selectedPhoto.creator}`} 
              className="max-h-[80vh] max-w-full mx-auto object-contain"
            />
            
            <div className="bg-black/70 p-4 text-white">
              <div className="flex justify-between items-center">
                <p className="font-medium">{selectedPhoto.creator}</p>
                <p className="text-sm text-gray-400">
                  {new Date(selectedPhoto.createdAt).toLocaleDateString()} a las{' '}
                  {new Date(selectedPhoto.createdAt).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="mt-2 flex justify-end">
                <a 
                  href={selectedPhoto.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Descargar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 