// /src/app/login/page.tsx
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AuthEmail from '@/components/AuthEmail'

export default async function LoginPage() {

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
