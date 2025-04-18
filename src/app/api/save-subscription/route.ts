import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const subscription = await req.json()

  const { endpoint, keys } = subscription

  // opcional: puedes ligarlo a user_id si estás autenticando
  const user_id = null

  const { error } = await supabase.from('push_subscriptions').insert({
    endpoint,
    keys,
    user_id,
  })

  if (error) {
    console.error('[❌] Error saving subscription:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
