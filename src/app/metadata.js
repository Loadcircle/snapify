// Metadata configuration for SEO
export const metadata = {
  metadataBase: process.env.NODE_ENV === 'development' 
    ? new URL('http://localhost:3000')
    : new URL(process.env.PROD_URL || 'https://snapify.app'),
  title: 'Snapify - Comparte fotos de eventos en tiempo real | Galería de fotos compartida',
  description: 'Snapify te permite crear galerías de fotos compartidas para eventos. Invitados pueden subir fotos en tiempo real, descargar y compartir recuerdos fácilmente. ¡Servicio gratuito!',
  keywords: 'galería de fotos compartida, fotos de eventos, compartir fotos, código QR fotos, galería de fotos en tiempo real, fotos de fiestas, compartir recuerdos',
  // Icons configuration
  icons: {
    icon: [
      { url: '/images/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/images/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/images/favicon/safari-pinned-tab.svg',
        color: '#f97316' // orange-500 color
      }
    ]
  },
  manifest: '/images/favicon/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Snapify'
  },
  openGraph: {
    title: 'Snapify - Galería de fotos compartida para eventos',
    description: 'Crea galerías de fotos compartidas para tus eventos. Invitados suben fotos en tiempo real, todos pueden ver y descargar los recuerdos.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Snapify',
    url: 'https://snapify.app',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Snapify - Comparte fotos de eventos en tiempo real',
        type: 'image/jpeg'
      }
    ],
    // Additional OpenGraph properties
    determiner: 'the',
    audio: null,
    video: null,
    // Facebook specific
    fb: {
      app_id: 'YOUR_FB_APP_ID' // Reemplazar con el ID de la app de Facebook si se tiene
    }
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snapify - Galería de fotos compartida para eventos',
    description: 'Crea galerías de fotos compartidas para tus eventos. Invitados suben fotos en tiempo real, todos pueden ver y descargar los recuerdos.',
    images: ['/og-image.jpg'],
    creator: '@snapify',
    site: '@snapify',
    // Additional Twitter properties
    card: 'summary_large_image',
    domain: 'snapify.app'
  },
  // Additional metadata for better social sharing
  other: {
    'og:price:amount': '0',
    'og:price:currency': 'USD',
    'og:availability': 'instock',
    'og:brand': 'Snapify',
    'og:category': 'Photo Sharing',
    'og:video': null,
    'og:audio': null,
    'og:locale:alternate': ['en_US', 'es_MX'],
    'og:see_also': [
      'https://snapify.app/events/create',
      'https://snapify.app/auth/signup'
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://snapify.app',
  },
};

// Viewport configuration
export const viewport = {
  themeColor: '#f97316', // orange-500 color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Structured data for rich snippets
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Snapify",
  "description": "Aplicación web para crear galerías de fotos compartidas para eventos. Permite a los invitados subir fotos en tiempo real y compartir recuerdos fácilmente.",
  "applicationCategory": "PhotoApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Código QR personalizado para cada evento",
    "Subida de fotos en tiempo real",
    "Galería compartida",
    "Descarga de fotos",
    "Interfaz móvil optimizada"
  ],
  // Additional structured data for social sharing
  "sameAs": [
    "https://facebook.com/snapify",
    "https://twitter.com/snapify",
    "https://instagram.com/snapify"
  ],
  "potentialAction": {
    "@type": "UseAction",
    "target": "https://snapify.app/events/create"
  }
}; 