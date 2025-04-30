'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchUserEvents = async () => {
      if (!session) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/events/user');
        
        if (!response.ok) {
          throw new Error('Failed to load your events. Please try again.');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching user events:', error);
        setError(error.message || 'Failed to load your events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) {
      fetchUserEvents();
    }
  }, [session, status, router]);
  
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Mi Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Mis Eventos</h2>
          <Link 
            href="/events/create" 
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Crear Nuevo Evento
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">Cargando eventos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <div className="bg-amber-50 p-8 rounded-lg inline-block">
              <svg className="w-16 h-16 mx-auto mb-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-gray-700 mb-4">No tienes eventos. Crea tu primer evento para comenzar.</p>
              <Link 
                href="/events/create" 
                className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Crear Mi Primer Evento
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fotos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expira
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
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
                      <Link href={`/events/${event.code}`} className="text-orange-500 hover:text-orange-700 mr-4">
                        Ver
                      </Link>
                      <Link href={`/events/${event.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {!isLoading && !error && events.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Total de Eventos</h3>
              <p className="text-2xl font-bold text-orange-500">{events.length}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Total de Fotos</h3>
              <p className="text-2xl font-bold text-orange-500">
                {events.reduce((total, event) => total + (event.usedPhotos || 0), 0)}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Eventos Activos</h3>
              <p className="text-2xl font-bold text-orange-500">
                {events.filter(event => new Date(event.expiresAt) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 