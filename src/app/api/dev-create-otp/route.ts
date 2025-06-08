// src/app/api/dev-create-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { phone, otp_code = '123456' } = await req.json()

  if (!phone) {
    return NextResponse.json({ error: 'Missing phone' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.rpc('insert_otp_simulado', {
      p_phone: phone,
      p_otp_code: otp_code
    })

    if (error) {
      console.error('❌ Supabase RPC error:', data, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ OTP simulado insertado correctamente')
    return NextResponse.json({ success: true, phone, otp_code })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error inesperado al insertar OTP:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
