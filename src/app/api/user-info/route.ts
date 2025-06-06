import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createSupabaseServerClient() // 👈 async

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('phone, country, preferred_language')
    .eq('id', user.id)
    .single()

  if (dbError || !userData) {
    console.error('Supabase error:', dbError?.message)
    return NextResponse.json({ error: 'No se encontró el usuario' }, { status: 404 })
  }

  return NextResponse.json({
    user_id: user.id,
    phone: userData.phone,
    country: userData.country,
    preferred_language: userData.preferred_language,
  })
}
