// src/app/api/login-phone/route.ts
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

  // Set cookie httpOnly
  const response = NextResponse.json({ success: true })
  response.cookies.set('user_id', user.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    // secure: true, // ⚠️ sólo en producción (HTTPS)
  })

  return response
}
  