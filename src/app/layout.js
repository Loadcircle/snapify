import './globals.css'

export const metadata = {
  title: 'Snapify',
  description: 'Tu aplicación de fotos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
