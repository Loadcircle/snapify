import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Orange Background */}
      <section className="bg-orange-500 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Comparte todos<br />
              los momentos<br />
              en un solo lugar
            </h1>
            
            <Link 
              href="/events/create" 
              className="inline-block bg-white text-black font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition duration-300"
            >
              Probar Snapify
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Cómo funciona</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 bg-orange-500 rounded-full w-12 h-12 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Contrata un paquete de fotos</h3>
              <p className="text-gray-600">Genera un evento con un código QR único personalizado</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 bg-orange-500 rounded-full w-12 h-12 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Escanea y toma fotos</h3>
              <p className="text-gray-600">Los invitados escanean el QR, capturan momentos especiales desde su teléfon</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 bg-orange-500 rounded-full w-12 h-12 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Visualiza las fotos</h3>
              <p className="text-gray-600">Mira y descarga todas las imágenes en una galería compartida</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-amber-100 py-4 px-8 rounded-lg">
              <h3 className="text-2xl font-bold">Gratis</h3>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 bg-orange-100 rounded-lg shadow-lg min-h-[300px] flex items-center justify-center">
              {/* Optional image - can be replaced with a div if image not available */}
              <div className="p-8 text-center text-orange-700">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p className="text-lg font-medium">Compartiendo momentos</p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Quiénes somos</h2>
              <p className="text-gray-700 mb-4">
                Nuestra misión es ayudarte a reunir y revivir recuerdos de tus eventos de manera facil y divertida, conectando a las personas a través de la fotografía.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Precios</h2>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Gratis</h3>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Contacto</h2>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Mensaje"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
