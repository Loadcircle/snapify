import './globals.css'
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Snapify',
  description: 'Tu aplicación de fotos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
