import { createSupabaseServerClient } from '@/lib/supabaseServer'

export default async function DebugPage() {
  const supabase = await createSupabaseServerClient() // 👈 necesario por async
  const { data: { user }, error } = await supabase.auth.getUser()

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-2">Usuario actual</h1>
      <pre className="bg-white text-black p-4 rounded shadow max-w-md overflow-auto">
        {JSON.stringify({ user, error }, null, 2)}
      </pre>
    </div>
  )
}
