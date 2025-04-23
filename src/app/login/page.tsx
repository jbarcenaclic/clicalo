// /src/app/login/page.tsx
// src/app/login/page.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import AuthEmail from '@/components/AuthEmail'

export default async function LoginPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookies() as any
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 👇 Si ya hay sesión, redirige
  if (user) {
    redirect('/') // o a /dashboard si lo tienes
  }

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <AuthEmail />
    </div>
  )
}
