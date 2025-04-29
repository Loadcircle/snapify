'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'react-qr-code';

export default function InvitePage({ params }) {
  const resolvedParams = use(params);
  const code = resolvedParams.code;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Get base URL for absolute links
    setBaseUrl(window.location.origin);
    
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="animate-pulse text-white text-xl">Loading invitation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  // Create QR code URL - direct to the capture page
  const captureUrl = `${baseUrl}/events/${code}/capture`;

  // Format date for display
  const expiresDate = new Date(event.expiresAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
            <p className="text-gray-500 mb-6">Take photos and share your moments with us!</p>
            
            <div className="bg-gray-100 p-8 rounded-lg mb-6 flex justify-center">
              {/* Real QR code */}
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <QRCode
                  value={captureUrl}
                  size={180}
                  level="H"
                  fgColor="#1F2937"
                  bgColor="#FFFFFF"
                />
              </div>
            </div>
            
            <div className="space-y-4 text-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Event Code</h2>
                <p className="text-2xl font-mono font-bold tracking-wider text-blue-600">{event.code}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-700">How to Join</h2>
                <p className="text-gray-600">
                  Scan the QR code with your phone's camera to take and share photos instantly
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Capture URL</h2>
                <a href={captureUrl} className="text-blue-500 underline break-all" target="_blank" rel="noopener noreferrer">
                  {captureUrl}
                </a>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Expires on</h2>
                <p className="text-gray-600">{expiresDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-600 p-6 text-center">
          <Link 
            href={captureUrl}
            className="inline-block text-white font-medium hover:underline"
          >
            Take Photos Now
          </Link>
        </div>
      </div>
    </div>
  );
} 