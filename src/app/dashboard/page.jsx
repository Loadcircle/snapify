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
  }, [session]);
  
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Mi Dashboard</h1>
        <Link 
          href="/events/create" 
          className="btn btn-primary inline-flex items-center justify-center w-full md:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Nuevo Evento
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Mis Eventos</h2>
          {events.length > 0 && !isLoading && (
            <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
              {events.length} {events.length === 1 ? 'evento' : 'eventos'}
            </span>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="w-12 h-12 border-t-4 border-orange-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Cargando eventos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md border border-red-100 text-red-600 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm underline mt-2 text-red-700"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <div className="bg-amber-50 p-6 rounded-lg inline-block max-w-lg mx-auto shadow-sm">
              <svg className="w-14 h-14 mx-auto mb-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No tienes eventos</h3>
              <p className="text-gray-600 mb-4">Crea tu primer evento para comenzar a capturar momentos especiales con tus invitados.</p>
              <Link 
                href="/events/create" 
                className="btn btn-primary inline-flex items-center justify-center w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Mi Primer Evento
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile view (card format) */}
            <div className="block md:hidden">
              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id} 
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-colors cursor-pointer"
                    onClick={() => router.push(`/events/${event.code}`)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                          <div className="inline-block text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 mb-2">
                            {event.code}
                          </div>
                        </div>
                        <div className="text-xs">
                          {new Date(event.expiresAt) > new Date() ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              {new Date(event.expiresAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                              Expirado
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center mb-1">
                          <div className="flex-1 text-xs text-gray-500">
                            Fotos: {event.usedPhotos} / {event.maxPhotos}
                          </div>
                        </div>
                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-orange-500"
                            style={{ width: `${(event.usedPhotos / event.maxPhotos) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        <Link 
                          href={`/events/${event.code}`} 
                          className="text-orange-500 hover:text-orange-700 transition-colors flex items-center mr-4"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver evento
                        </Link>
                        <Link 
                          href={`/capture/${event.code}`} 
                          className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Tomar foto
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop view (table format) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
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
                    <tr 
                      key={event.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/events/${event.code}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 inline-block">{event.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="absolute left-0 top-0 h-full bg-orange-500"
                              style={{ width: `${(event.usedPhotos / event.maxPhotos) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500 ml-3">
                            {event.usedPhotos} / {event.maxPhotos}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(event.expiresAt) > new Date() ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              {new Date(event.expiresAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                              Expirado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex space-x-3">
                          <Link 
                            href={`/events/${event.code}`} 
                            className="text-orange-500 hover:text-orange-700 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                          </Link>
                          <Link 
                            href={`/capture/${event.code}`} 
                            className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Tomar foto
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      
      {!isLoading && !error && events.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 border-b pb-3">Estadísticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-orange-50 p-4 sm:p-6 rounded-lg border border-orange-100 transition-transform hover:translate-y-[-5px]">
              <div className="flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-semibold text-gray-700">Total de Eventos</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-orange-500">{events.length}</p>
            </div>
            <div className="bg-amber-50 p-4 sm:p-6 rounded-lg border border-amber-100 transition-transform hover:translate-y-[-5px]">
              <div className="flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-semibold text-gray-700">Total de Fotos</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-amber-500">
                {events.reduce((total, event) => total + (event.usedPhotos || 0), 0)}
              </p>
            </div>
            <div className="bg-green-50 p-4 sm:p-6 rounded-lg border border-green-100 transition-transform hover:translate-y-[-5px]">
              <div className="flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-gray-700">Eventos Activos</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-500">
                {events.filter(event => new Date(event.expiresAt) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 