'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EventForm from '@/components/EventForm';

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    setLimitReached(false);
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        // Check if this is a limit reached error
        if (response.status === 403 && responseData.limitReached) {
          setLimitReached(true);
          throw new Error(responseData.error || 'Has alcanzado el límite de eventos gratuitos');
        }
        
        throw new Error(responseData.error || 'Error al crear el evento');
      }
      
      // Redirect to the event page
      router.push(`/events/${responseData.code}`);
    } catch (error) {
      console.error('Error al crear el evento:', error);
      setError(error.message || 'Error al crear el evento. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-orange-600 hover:text-orange-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al inicio
            </Link>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-8 border-t-4 border-orange-500">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Crear Nuevo Evento</h1>
            
            {error && (
              <div className={`p-4 rounded-md mb-6 border ${limitReached ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                <p>{error}</p>
                
                {limitReached && (
                  <div className="mt-4">
                    <p className="mb-2">Si deseas crear más eventos, puedes comprar paquetes adicionales. Estamos trabajando para ofrecerte más opciones de pago.</p>
                    <Link href="/dashboard" className="text-orange-600 hover:text-orange-700 font-medium">
                      Ver mis eventos actuales →
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {!limitReached && <EventForm onSubmit={handleSubmit} />}
          </div>
        </div>
      </div>
    </div>
  );
} 