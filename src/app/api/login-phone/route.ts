import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { phone } = await req.json()

  if (!phone) {
    return NextResponse.json({ error: 'Missing phone' }, { status: 400 })
  }

  // Buscar o crear usuario
  let { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('phone', phone)
    .single()

  if (!user) {
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ phone })
      .select('id')
      .single()

    if (error || !newUser) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    user = newUser
  }

  return NextResponse.json({ user_id: user.id })
}
