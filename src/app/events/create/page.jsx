'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EventForm from '@/components/EventForm';

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
      
      const event = await response.json();
      
      // Redirect to the event page
      router.push(`/events/${event.code}`);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.message || 'Failed to create event. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
              {error}
            </div>
          )}
          
          <EventForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
} 