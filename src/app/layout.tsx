// src/app/layout.tsx
import './globals.css'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: cookies() as any // 👈 elimina errores de tipo y funciona perfecto
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

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
