// src/app/layout.tsx
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import UserStatus from '@/components/UserStatus'
import { LoginProvider } from '@/context/LoginContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <LoginProvider>
          <header className="p-4 bg-zinc-900 text-white flex justify-between items-center">
            <span>🚀 CLÍCALO</span>
            <UserStatus />
          </header>
          <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-clicalo-azul to-clicalo-azul/50">
            <SpeedInsights />
            {children}
          </main>
        </LoginProvider>
      </body>
    </html>
  )
}
