import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inventar.IO - Sistema de Inventario',
  description: 'Sistema de gestión de inventario y ventas',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
