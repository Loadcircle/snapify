import './globals.css'
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Snapify',
  description: 'Tu aplicación de fotos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <Toaster position="bottom-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
