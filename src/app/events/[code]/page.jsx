'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PhotoUploader from '@/components/PhotoUploader';
import PhotoGallery from '@/components/PhotoGallery';

export default function EventPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const resolvedParams = use(params);
  const code = resolvedParams.code;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
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
  
  // Redirect to capture page if user is not authenticated
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push(`/events/${code}/capture`);
    }
  }, [session, status, code, router]);
  
  const handlePhotoUploaded = (photo) => {
    // Update the event data with the new photo count
    setEvent(prev => ({
      ...prev,
      usedPhotos: prev.usedPhotos + 1,
    }));
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
            <Link href="/" className="text-blue-600 hover:underline">
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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
        
        <div className="flex gap-3">
          <Link 
            href={`/events/${code}/invite`}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm5 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              <path d="M4.5 6.5A1.5 1.5 0 016 5h.5a.5.5 0 010 1H6a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-.5a.5.5 0 011 0v.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014.5 13.5v-7z" />
            </svg>
            Invitation
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-500">
              Event Code: <span className="font-mono font-bold">{event.code}</span>
            </p>
          </div>
          
          <div className="text-right">
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
          <div className="mb-8">
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
          <PhotoGallery eventId={event.id} />
        </div>
      </div>
    </div>
  );
} 