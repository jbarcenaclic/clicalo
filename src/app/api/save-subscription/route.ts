// src/app/api/save-subscription/route.ts
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { endpoint, keys } = body

  const { data: existing } = await supabase
    .from('push_subscriptions')
    .select('id')
    .eq('endpoint', endpoint)
    .maybeSingle()

  if (!existing) {
    await supabase.from('push_subscriptions').insert({
      endpoint,
      keys,
      user_id: user.id
    })
  }

  return NextResponse.json({ ok: true })
}
