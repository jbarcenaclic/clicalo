'use client'

import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import UserStatus from '@/components/UserStatus'
import { LoginProvider } from '@/context/LoginContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isEmbedded, setIsEmbedded] = useState(false)

  useEffect(() => {
    // Detecta si la página está embebida (ej. en un iframe de un modal)
    setIsEmbedded(window.self !== window.top)
  }, [])

  return (
    <html lang="es" className="h-full">
      <body className="bg-white">
        <div className="pt-16 bg-clicalo-azul">
          <LoginProvider>
            {!isEmbedded && (
              <header className="fixed top-0 left-0 w-full z-50 p-4 bg-zinc-900 text-white flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">🚀 CLÍCALO</span>
                </div>

                <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                  <UserStatus />
                </div>
              </header>
            )}

            <main className="flex flex-col items-center justify-center min-h-screen">
              <SpeedInsights />
              {children}
              {!isEmbedded && <Footer />}
            </main>
          </LoginProvider>
        </div>
      </body>
    </html>
  )
}
