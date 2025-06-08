// src/app/api/user-info/route.ts
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createSupabaseServerClient() // 👈 async

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    console.warn('⚠️ No hay sesión activa para este request.')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (error) {
    console.error('Error al obtener el usuario:', error.message)
    return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 })
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
