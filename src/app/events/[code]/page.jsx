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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
        
        // Initialize editable fields
        setTitle(data.title);
        setExpiresAt(new Date(data.expiresAt).toISOString().split('T')[0]);
        setAllowedFilters(data.allowedFilters ? data.allowedFilters.split(',') : ['none']);
        setMaxPhotosPerUser(data.maxPhotosPerUser || data.maxPhotos);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error.message || 'Failed to load event. Please try again.');
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
  
  const handleSaveChanges = async () => {
    if (!event) return;
    
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
        throw new Error(errorData.error || 'Failed to update event');
      }
      
      const data = await response.json();
      
      // Update local state
      setEvent({
        ...event,
        ...data,
      });
      
      setIsEditing(false);
      toast.success('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.message || 'Failed to update event. Please try again.');
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
          <p className="text-gray-500">Loading event...</p>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Loading event...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              &larr; Back to Home
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
        <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Link 
            href={`/events/${code}/gallery`}
            target='_blank'
            className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center text-sm flex-1 sm:flex-auto justify-center sm:justify-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Gallery
          </Link>
          
          <Link 
            href={`/events/${code}/invite`}
            className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center text-sm flex-1 sm:flex-auto justify-center sm:justify-start"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm5 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              <path d="M4.5 6.5A1.5 1.5 0 016 5h.5a.5.5 0 010 1H6a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-.5a.5.5 0 011 0v.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014.5 13.5v-7z" />
            </svg>
            Invitation
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
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <div className="w-full">
            {!isEditing ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                  <p className="text-gray-500">
                    Event Code: <span className="font-mono font-bold">{event.code}</span>
                  </p>
                  <div className="sm:hidden">
                    <p className="text-sm text-gray-500">
                      Photos: {event.usedPhotos} / {event.maxPhotos}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires: {new Date(event.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 mb-4">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
                  >
                    Edit Event Details
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="mb-3">
                  <p className="block text-sm font-medium mb-1">
                    Event Code: <span className="font-mono font-bold">{event.code}</span>
                  </p>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Photos per User Limit (Optional)
                  </label>
                  <input
                    type="number"
                    value={maxPhotosPerUser}
                    onChange={(e) => setMaxPhotosPerUser(e.target.value)}
                    min="1"
                    max={event.maxPhotos}
                    placeholder={`Default: ${event.maxPhotos}`}
                    className="w-full p-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum number of photos each user can upload. Leave empty to use event limit.
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Allowed Filters
                  </label>
                  <div className="mb-1 text-xs text-gray-500">
                    Select the filters you want to allow for this event. At least one filter must be selected.
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
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 text-sm"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="hidden sm:block text-right">
            <p className="text-sm text-gray-500">
              Photos: {event.usedPhotos} / {event.maxPhotos}
            </p>
            <p className="text-sm text-gray-500">
              Expires: {new Date(event.expiresAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md text-blue-700 mb-6">
          <p className="font-semibold">Admin View</p>
          <p className="text-sm">This is the admin view for managing this event. Guests can upload photos by scanning the QR code or visiting the invitation page.</p>
        </div>
        
        {isExpired ? (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 mb-6">
            This event has expired. You can view photos but cannot add new ones.
          </div>
        ) : isMaxPhotosReached ? (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 mb-6">
            This event has reached the maximum number of photos. You can view photos but cannot add new ones.
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Add Photos (Admin Upload)</h2>
            <PhotoUploader 
              eventId={event.id} 
              eventCode={event.code}
              onPhotoUploaded={handlePhotoUploaded}
              isAdminView={true}
            />
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-bold mb-4">Photo Gallery</h2>
          <PhotoGallery eventId={event.id} isAdminView={true} />
        </div>
      </div>
    </div>
  );
} 