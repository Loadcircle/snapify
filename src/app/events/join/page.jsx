'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JoinEventPage() {
  const router = useRouter();
  const [eventCode, setEventCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventCode.trim()) {
      setError('Please enter an event code');
      return;
    }
    
    setIsChecking(true);
    setError('');
    
    try {
      // Check if the event exists
      const response = await fetch(`/api/events/${eventCode}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found. Please check the code and try again.');
        }
        throw new Error('Failed to check event. Please try again.');
      }
      
      // If we get here, the event exists - redirect to it
      router.push(`/events/${eventCode}`);
    } catch (error) {
      console.error('Error checking event:', error);
      setError(error.message || 'Failed to check event. Please try again.');
      setIsChecking(false);
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
          <h1 className="text-2xl font-bold mb-6">Join an Event</h1>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="eventCode" className="block text-sm font-medium mb-1">
                Event Code
              </label>
              <input
                type="text"
                id="eventCode"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                placeholder="Enter event code"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isChecking || !eventCode.trim()}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isChecking ? 'Checking...' : 'Join Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 