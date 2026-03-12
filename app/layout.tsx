import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Magallanes — IBS',
  description: 'Plataforma de pensamiento crítico para el MBAI de IBS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="noise-overlay">
        {children}
      </body>
    </html>
  )
}
