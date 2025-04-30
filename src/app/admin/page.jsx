'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/events');
        
        if (!response.ok) {
          throw new Error('Failed to load events. Please try again.');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message || 'Failed to load events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Placeholder until we create the actual admin API endpoint
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!session || session.user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 p-6 rounded-md text-red-500">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Events Management</h2>
          <Link 
            href="/events/create" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Event
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">Loading events...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No events found. Create your first event to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-500">{event.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{event.usedPhotos} / {event.maxPhotos}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(event.expiresAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/events/${event.code}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </Link>
                      <Link href={`/admin/events/${event.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Administration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-700 mb-2">Users</h3>
            <p className="text-gray-500 text-sm mb-3">Manage user accounts and permissions</p>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => alert('User management will be implemented soon')}
            >
              Manage Users →
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-700 mb-2">Settings</h3>
            <p className="text-gray-500 text-sm mb-3">Configure system settings and preferences</p>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => alert('Settings will be implemented soon')}
            >
              Edit Settings →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 