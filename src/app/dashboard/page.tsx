// app/dashboard/page.tsx
import LogoutButton from '@/components/LogoutButton'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'

export default async function DashboardPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookies() as any }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-2">Bienvenido, {user.email}</h1>
      <LogoutButton />
    </div>
  )
}
