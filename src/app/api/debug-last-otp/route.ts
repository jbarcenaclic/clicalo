// src/app/api/debug-last-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')?.trim()
  if (!phone || !phone.startsWith('+')) {
    return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
  }
  console.log('🔍 Buscando OTP para el teléfono:', phone)

  const { data, error } = await supabase
    .rpc('debug_otp_by_phone', { p_phone: phone })

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: error?.message || 'OTP no encontrado' }, { status: 404 })
  }

  const [otp] = data

  return NextResponse.json({
    otp_code: otp.otp_code,
    phone,
    created_at: otp.created_at,
    factor_id: otp.factor_id,
    user_id: otp.user_id
  })
}
