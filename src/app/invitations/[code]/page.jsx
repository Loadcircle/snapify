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
            throw new Error('Evento no encontrado. Por favor verifica el código e intenta de nuevo.');
          }
          throw new Error('Error al cargar el evento. Por favor intenta de nuevo.');
        }
        
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error.message || 'Error al cargar el evento. Por favor intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [code]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-orange-400 to-amber-600">
        <div className="animate-pulse text-white text-xl">Cargando invitación...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-orange-400 to-amber-600">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <Link href="/" className="mt-6 inline-block text-orange-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  // Create QR code URL - direct to the capture page
  const captureUrl = `${baseUrl}/capture/${code}`;
  const galleryUrl = `${baseUrl}/events/${code}/gallery`;

  // Format date for display
  const expiresDate = new Date(event.expiresAt).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="h-screen flex justify-center items-center bg-amber-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border-t-4 border-orange-500 print:shadow-none my-4">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white text-center">
          <h1 className="text-3xl font-bold">{event.title}</h1>
        </div>
        
        <div className="p-6 flex flex-col md:flex-row">
          {/* QR Code - Elemento principal */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center mb-6 md:mb-0 md:mr-8">
            <div className="bg-white p-4 rounded-lg shadow-lg mb-4 border-4 border-orange-200">
              <QRCode
                value={captureUrl}
                size={180}
                level="H"
                fgColor="#1F2937"
                bgColor="#FFFFFF"
              />
            </div>
          </div>
          
          {/* Instrucciones claras */}
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">¿Cómo participar?</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center mb-1">
                  <div className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-2">
                    <span className="text-xs">1</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">Escanea el QR</h3>
                </div>
                <p className="text-gray-700 text-xs">Usa la cámara de tu teléfono para escanear el código.</p>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center mb-1">
                  <div className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-2">
                    <span className="text-xs">2</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">Toma fotos</h3>
                </div>
                <p className="text-gray-700 text-xs">Accede a la cámara desde tu navegador. Sin apps.</p>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center mb-1">
                  <div className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-2">
                    <span className="text-xs">3</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">Comparte</h3>
                </div>
                <p className="text-gray-700 text-xs">Las fotos se guardan automáticamente en la galería.</p>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center mb-1">
                  <div className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-white mr-2">
                    <span className="text-xs">4</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">Disfruta</h3>
                </div>
                <p className="text-gray-700 text-xs">Accede a la galería para ver todas las fotos.</p>
              </div>
            </div>
            
            {/* Información adicional */}
            <div className="mt-4 text-center text-xs text-gray-600">
              <p>
                <span className="font-semibold">Disponible hasta:</span> {expiresDate}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer con botones */}
        <div className="bg-gray-100 p-3 text-center print:hidden flex justify-center space-x-4">
          <Link 
            href={captureUrl}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            Tomar fotos
          </Link>
          <Link 
            href={galleryUrl}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
          >
            Ver galería
          </Link>
        </div>
        <div className="w-full text-center mt-2 mb-2">
          <p className="text-xs text-gray-600 break-all">
            O visita en tu teléfono: <a href={captureUrl} className="text-orange-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">{captureUrl}</a>
          </p>
        </div>
        
        {/* Marca de agua */}
        <div className="bg-white p-2 text-center text-xs text-gray-400 print:hidden">
          <p>Captura momentos con <span className="font-bold text-orange-500">Snapify</span></p>
        </div>
      </div>
    </div>
  );
} 