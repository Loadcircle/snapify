import './globals.css'
import AuthProvider from '@/components/AuthProvider';
import { Analytics } from "@vercel/analytics/react"
import PrefetchRoutes from '@/components/PrefetchRoutes';

export const metadata = {
  title: 'Snapify',
  description: 'Tu aplicación de fotos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Analytics />
        <AuthProvider>
          <PrefetchRoutes />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
