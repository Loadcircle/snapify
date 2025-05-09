'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PhotoUploader from '@/components/PhotoUploader';
import PhotoGallery from '@/components/PhotoGallery';
import { toast } from 'react-hot-toast';

// Define los mismos filtros que en la página de captura
const FILTERS = {
  none: { name: 'Normal', css: '' },
  sepia: { name: 'Vintage', css: 'sepia(0.7)' },
  grayscale: { name: 'B&W', css: 'grayscale(1)' },
  contrast: { name: 'Vivid', css: 'contrast(1.5) saturate(1.5)' },
  warm: { name: 'Warm', css: 'sepia(0.3) saturate(1.6) hue-rotate(-15deg)' },
};

export default function EventPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const resolvedParams = use(params);
  const code = resolvedParams.code;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Editable fields state
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [allowedFilters, setAllowedFilters] = useState(['none']);
  const [maxPhotosPerUser, setMaxPhotosPerUser] = useState('');
  const [maxPhotosPerUserError, setMaxPhotosPerUserError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/${code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Evento no encontrado. Por favor verifica el código e intenta de nuevo.');
          }
          throw new Error('Error al cargar el evento. Por favor intenta de nuevo.');
        }
        
        const data = await response.json();
        setEvent(data);
        
        // Initialize editable fields
        setTitle(data.title);
        setExpiresAt(new Date(data.expiresAt).toISOString().split('T')[0]);
        setAllowedFilters(data.allowedFilters ? data.allowedFilters.split(',') : ['none']);
        setMaxPhotosPerUser(data.maxPhotosPerUser || data.maxPhotos);
      } catch (error) {
        console.error('Error al cargar el evento:', error);
        setError(error.message || 'Error al cargar el evento. Por favor intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [code]);
  
  // Redirect to capture page if user is not authenticated
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push(`/capture/${code}`);
    }
  }, [session, status, code, router]);
  
  const handlePhotoUploaded = (photo) => {
    // Update the event data with the new photo count
    setEvent(prev => ({
      ...prev,
      usedPhotos: prev.usedPhotos + 1,
    }));
  };
  
  const handleMaxPhotosPerUserChange = (e) => {
    const value = e.target.value;
    
    // Si el campo está vacío, permitimos borrar el valor
    if (value === '') {
      setMaxPhotosPerUser('');
      setMaxPhotosPerUserError('');
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    // Validar que sea un número positivo
    if (isNaN(numValue) || numValue <= 0) {
      setMaxPhotosPerUserError('Debe ser un número positivo');
      setMaxPhotosPerUser(value);
      return;
    }
    
    // Validar que no exceda el máximo de fotos del evento
    if (numValue > event.maxPhotos) {
      setMaxPhotosPerUserError(`No puede exceder el máximo del evento (${event.maxPhotos})`);
      setMaxPhotosPerUser(value);
      return;
    }
    
    // Si pasa todas las validaciones
    setMaxPhotosPerUserError('');
    setMaxPhotosPerUser(numValue);
  };
  
  const handleSaveChanges = async () => {
    if (!event) return;
    
    // Validar antes de guardar
    if (maxPhotosPerUserError) {
      toast.error('Por favor corrige los errores antes de guardar');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Format dates
      const expiresAtDate = new Date(expiresAt);
      expiresAtDate.setHours(23, 59, 59, 999);
      
      const updatedEvent = {
        title,
        expiresAt: expiresAtDate.toISOString(),
        allowedFilters: allowedFilters.join(','),
        maxPhotosPerUser: maxPhotosPerUser ? parseInt(maxPhotosPerUser) : event.maxPhotos,
      };
      
      const response = await fetch(`/api/events/${code}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el evento');
      }
      
      const data = await response.json();
      
      // Update local state
      setEvent({
        ...event,
        ...data,
      });
      
      setIsEditing(false);
      toast.success('¡Evento actualizado exitosamente!');
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      toast.error(error.message || 'Error al actualizar el evento. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const filterId = e.target.value;
    setAllowedFilters(prev => {
      // If trying to deselect the last filter, prevent it
      if (prev.length === 1 && prev.includes(filterId)) {
        return prev;
      }
      
      // Toggle the filter
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };
  
  // Show loading state while checking authentication
  if (status === 'loading' || (status !== 'loading' && !session)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Cargando evento...</p>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Cargando evento...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link href="/dashboard" className="text-orange-600 hover:underline">
              &larr; Volver al Dashboard
            </Link>
          </div>
          
          <div className="bg-red-50 p-6 rounded-md text-red-500">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p>{error}</p>
          </div>
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
  
  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/dashboard" className="text-orange-600 hover:text-orange-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Dashboard
        </Link>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Link 
            href={`/invitations/${code}`}
            className="px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center text-sm flex-1 sm:flex-auto justify-center sm:justify-start font-medium shadow-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm5 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              <path d="M4.5 6.5A1.5 1.5 0 016 5h.5a.5.5 0 010 1H6a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-.5a.5.5 0 011 0v.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014.5 13.5v-7z" />
            </svg>
            Ver Invitación
          </Link>
          
          <Link 
            href={`/events/${code}/gallery`}
            target='_blank'
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center text-sm flex-1 sm:flex-auto justify-center sm:justify-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ver Galería
          </Link>
          
          <Link 
            href={`/capture/${code}`}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm flex-1 sm:flex-auto justify-center sm:justify-start"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Tomar Foto
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Details Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Detalles del Evento</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nombre de tu evento que verán tus invitados en la galería.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Límite de Fotos por Usuario (Opcional)
                  </label>
                  <input
                    type="number"
                    value={maxPhotosPerUser}
                    onChange={handleMaxPhotosPerUserChange}
                    min="1"
                    max={event.maxPhotos}
                    placeholder={`Predeterminado: ${event.maxPhotos}`}
                    className={`w-full p-2 border rounded-md ${maxPhotosPerUserError ? 'border-red-500' : ''}`}
                  />
                  {maxPhotosPerUserError && (
                    <p className="text-xs text-red-500 mt-1">{maxPhotosPerUserError}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Número máximo de fotos que cada invitado puede subir. Deja vacío para usar el límite total del evento ({event.maxPhotos} fotos). Esto te permite controlar cuántas fotos puede aportar cada persona.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Filtros Permitidos
                  </label>
                  <div className="mb-1 text-xs text-gray-500">
                    Selecciona los filtros que deseas permitir para este evento. Al menos un filtro debe estar seleccionado. Estos son los efectos que podrán utilizar tus invitados al tomar fotos.
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {Object.entries(FILTERS).map(([id, filter]) => (
                      <label
                        key={id}
                        className={`p-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                          allowedFilters.includes(id)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={id}
                          checked={allowedFilters.includes(id)}
                          onChange={handleFilterChange}
                          className="hidden"
                        />
                        {filter.name}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving || maxPhotosPerUserError}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300 text-sm"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Event Stats */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Estadísticas del Evento</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Código del Evento</p>
                  <p className="text-lg font-semibold font-mono">{event.code}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Código único para acceder a tu evento.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Fotos</p>
                  <p className="text-2xl font-bold">{event.usedPhotos} / {event.maxPhotos}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Número de fotos subidas hasta el momento y límite total del paquete contratado.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Expiración</p>
                  <p className="text-lg font-semibold">{new Date(event.expiresAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Fecha hasta la que estará disponible tu evento y sus fotos. Después de esta fecha, no se podrán añadir más fotos.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Límite de Fotos por Usuario</p>
                  <p className="text-lg font-semibold">{maxPhotosPerUser || event.maxPhotos}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Número máximo de fotos que cada invitado puede subir a este evento.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md text-blue-700">
              <p className="font-semibold">Vista de Administrador</p>
              <p className="text-sm">Esta es la vista de administrador para gestionar este evento. Los invitados pueden subir fotos escaneando el código QR o visitando la página de invitación.</p>
            </div>
          </div>
        </div>
        
        {isExpired ? (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 mt-6">
            Este evento ha expirado. Puedes ver las fotos pero no puedes añadir nuevas.
          </div>
        ) : isMaxPhotosReached ? (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 mt-6">
            Este evento ha alcanzado el número máximo de fotos. Puedes ver las fotos pero no puedes añadir nuevas.
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Añadir Fotos (Subida de Administrador)</h2>
            <PhotoUploader 
              eventId={event.id} 
              eventCode={event.code}
              onPhotoUploaded={handlePhotoUploaded}
              isAdminView={true}
            />
          </div>
        )}
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Galería de Fotos</h2>
          <PhotoGallery eventId={event.id} isAdminView={true} />
        </div>
      </div>
    </div>
  );
} 