import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Hero Section with Orange Background */}
        <section className="bg-orange-500 text-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                Comparte todos<br />
                los momentos<br />
                en un solo lugar
              </h1>
              
              <Link 
                href="/events/create" 
                className="btn btn-primary bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg shadow-md hover:shadow-lg"
              >
                Probar Snapify
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-amber-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">Cómo funciona</h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Contrata un paquete de fotos</h3>
                <p className="text-gray-600">Genera un evento con un código QR único personalizado para compartir con tus invitados.</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Escanea y toma fotos</h3>
                <p className="text-gray-600">Los invitados escanean el QR y capturan momentos especiales desde su teléfono móvil fácilmente.</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
                <div className="mb-6 bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Visualiza las fotos</h3>
                <p className="text-gray-600">Mira y descarga todas las imágenes en una galería compartida. Conserva los recuerdos para siempre.</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="inline-block bg-amber-100 py-5 px-10 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-orange-600">¡Servicio Gratuito!</h3>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 bg-orange-100 rounded-lg shadow-lg min-h-[300px] flex items-center justify-center">
                <div className="p-8 text-center text-orange-700">
                  <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <p className="text-xl font-medium">Compartiendo momentos juntos</p>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Quiénes somos</h2>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Nuestra misión es ayudarte a reunir y revivir recuerdos de tus eventos de manera fácil y divertida, conectando a las personas a través de la fotografía.
                </p>
                <Link 
                  href="/events/create" 
                  className="btn btn-primary inline-flex items-center"
                >
                  Comenzar ahora
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact and Pricing Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Precios</h2>
                <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-orange-500">
                  <div className="text-center mb-6">
                    <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-medium">Plan Básico</span>
                    <h3 className="text-3xl font-bold mt-2 mb-1">Gratis</h3>
                    <p className="text-gray-500">Sin costo para uso personal</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Código QR personalizado
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Galería compartida
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Descarga de fotos
                    </li>
                  </ul>
                  
                  <Link 
                    href="/auth/signup" 
                    className="btn btn-primary w-full flex justify-center"
                  >
                    Registrarse ahora
                  </Link>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Contacto</h2>
                <form className="bg-white p-8 rounded-lg shadow-md space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                    <textarea
                      id="message"
                      placeholder="¿Cómo podemos ayudarte?"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full"
                  >
                    Enviar mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <Link href="/" className="text-2xl font-bold text-orange-400">
                  Snapify
                </Link>
                <p className="mt-2 text-gray-400 text-sm">Captura momentos, comparte recuerdos</p>
              </div>
              <div className="flex space-x-6">
                <Link href="/events/create" className="text-gray-300 hover:text-white transition-colors">
                  Crear evento
                </Link>
                <Link href="/auth/signin" className="text-gray-300 hover:text-white transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/auth/signup" className="text-gray-300 hover:text-white transition-colors">
                  Registrarse
                </Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Snapify. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
