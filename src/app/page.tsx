// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import ClientLanding from '@/components/ClientLanding'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/tasks') // 👈 sesión activa, redirige
  }

  return <ClientLanding /> // 👈 no logueado, mostrar landing
}
