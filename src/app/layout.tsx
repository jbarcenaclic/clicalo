// src/app/layout.tsx
import './globals.css'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { SpeedInsights } from "@vercel/speed-insights/next"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ✅ Aquí usamos la clave pública
    {
      cookies: cookies() as any
    }
  )

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
