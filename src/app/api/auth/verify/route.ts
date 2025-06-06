import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const { phone, token } = await req.json()
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
