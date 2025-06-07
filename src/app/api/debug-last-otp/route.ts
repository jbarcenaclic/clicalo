// src/app/api/debug-last-otp/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('auth.otp')
    .select('token_hash, created_at, phone')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: 'No OTP found' }, { status: 404 })
  }

  return NextResponse.json({
    token: '(no visible OTP — token is hashed)',
    phone: data[0].phone,
    timestamp: data[0].created_at
  })
}
