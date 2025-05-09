import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { metadata, structuredData } from './metadata';

export { metadata };

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section with Orange Background */}
        <section className="bg-orange-500 text-white py-20 md:py-28" aria-label="Introducción">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                Haz que cada momento cuente.
              </h1>
              <p className="text-xl mb-8 text-orange-100">
                Captura recuerdos en tiempo real, directo desde el celular de tus invitados.
              </p>
              
              <Link 
                href="/events/create" 
                className="btn btn-primary bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg shadow-md hover:shadow-lg"
                aria-label="Comenzar a crear galería de fotos"
              >
                Probar Snapify
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-amber-50" aria-label="Cómo funciona">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">Sin apps, sin complicaciones. Solo escanea, toma la foto y guárdala para siempre.</h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <article className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Crea tu evento personalizado</h3>
                <p className="text-gray-600">Define el nombre de tu evento, elige cuántas fotos deseas guardar y selecciona un filtro único para todas tus imágenes. ¡Listo en segundos!</p>
              </article>
              
              <article className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Personaliza tu experiencia</h3>
                <p className="text-gray-600">Decide si deseas limitar la cantidad de fotos por invitado. Control total para ti, sin complicaciones.</p>
              </article>
              
              <article className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Comparte tu invitación</h3>
                <p className="text-gray-600">Tu evento genera automáticamente un código QR. Solo imprímelo o muéstralo en pantalla durante tu fiesta.</p>
              </article>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
              <article className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Tus invitados toman las fotos</h3>
                <p className="text-gray-600">Cada persona escanea el QR y accede a una cámara especial desde su navegador. No necesitan instalar nada.</p>
              </article>
              
              <article className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Las fotos se guardan automáticamente</h3>
                <p className="text-gray-600">Todas las imágenes se suben directamente a tu álbum, con el filtro que elegiste aplicado en tiempo real.</p>
              </article>
            </div>

            <div className="mt-8 max-w-5xl mx-auto">
              <article className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">Comparte la galería</h3>
                <p className="text-gray-600 text-center">Después del evento, accede a tu galería completa y compártela con quien quieras. ¡Revive el momento una y otra vez!</p>
              </article>
            </div>

            <div className="mt-16 text-center">
              <div className="inline-block bg-amber-100 py-5 px-10 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-orange-600">¡Servicio Gratuito!</h3>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-20" aria-label="Sobre nosotros">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 bg-orange-100 rounded-lg shadow-lg min-h-[300px] flex items-center justify-center">
                <div className="p-8 text-center text-orange-700">
                  <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <p className="text-xl font-medium">Compartiendo momentos juntos</p>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">¿Listo para capturar tu próxima fiesta como nunca antes?</h2>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Empieza ahora — elige tu paquete y crea tu evento en segundos.
                </p>
                <Link 
                  href="/events/create" 
                  className="btn btn-primary inline-flex items-center"
                  aria-label="Comenzar a crear galería de fotos"
                >
                  Comenzar ahora
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gray-50" aria-label="Precios">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Precios</h2>
                <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-medium">Plan Básico</span>
                    <h3 className="text-3xl font-bold mt-2 mb-1">Gratis</h3>
                    <p className="text-gray-500">Sin costo para uso personal</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Código QR personalizado
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Galería compartida
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Descarga de fotos
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Hasta 50 fotos por evento
                    </li>
                  </ul>
                  
                  <Link 
                    href="/auth/signup" 
                    className="btn btn-primary w-full flex justify-center"
                    aria-label="Registrarse en Snapify"
                  >
                    Registrarse ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <Link href="/" className="text-2xl font-bold text-orange-400" aria-label="Snapify - Inicio">
                  Snapify
                </Link>
                <p className="mt-2 text-gray-400 text-sm">Captura momentos, comparte recuerdos</p>
              </div>
              <nav className="flex space-x-6" aria-label="Enlaces principales">
                <Link href="/events/create" className="text-gray-300 hover:text-white transition-colors">
                  Crear evento
                </Link>
                <Link href="/auth/signin" className="text-gray-300 hover:text-white transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/auth/signup" className="text-gray-300 hover:text-white transition-colors">
                  Registrarse
                </Link>
              </nav>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Snapify. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
