// src/app/layout.tsx
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { supabase } from '@/lib/supabaseClient'

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const { data: { user } } = await supabase.auth.getUser()
  console.log('user:', user)

  return (
    <html lang="es">
      <body>
        <header className="p-4 bg-zinc-900 text-white flex justify-between items-center">
          <span>🚀 CLÍCALO</span>
          <span className="text-sm">
            {user?.id ? '🔓 Loggeado' : '🔒 No loggeado'}
          </span>
        </header>
        {children}
      </body>
    </html>
  )
}
