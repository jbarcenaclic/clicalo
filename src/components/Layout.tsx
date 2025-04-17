import { ReactNode } from 'react'
import Logo from './Logo'

export const metadata = {
  title: 'CLÍCALO – Plataforma de Recompensas',
  description: 'Gana dinero real con tiradas diarias desde tu celular.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="es">
      <head />
      <body>
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
          <Logo />
          {children}
        </main>
      </body>
    </html>
  )
}
