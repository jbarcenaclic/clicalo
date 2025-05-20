// src/app/layout.tsx
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import UserStatus from '@/components/UserStatus'
import { LoginProvider } from '@/context/LoginContext'
import { headers } from 'next/headers'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()  // ✅ usar await
  const pathname = headersList.get('x-invoke-path') || ''
  const esTriviaLocal = pathname.startsWith('/juego-trivia-local')

  return (
    <html lang="es">
      <body className="bg-white">  {/* o sin className si quieres más limpio */}
        <div className={esTriviaLocal ? '' : 'pt-16 bg-clicalo-azul'}>
          <LoginProvider>
            {!esTriviaLocal && (
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
            </main>
          </LoginProvider>
        </div>
      </body>
    </html>
  )
}
