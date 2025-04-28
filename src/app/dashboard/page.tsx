// app/dashboard/page.tsx
import LogoutButton from '@/components/LogoutButton'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default async function DashboardPage() {

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-2">Bienvenido, {user.email}</h1>
      <LogoutButton />
    </div>
  )
}
