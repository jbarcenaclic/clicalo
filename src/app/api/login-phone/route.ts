// src/app/api/login-phone/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGeolocation } from '@/utils/getGeolocation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { phone } = await req.json()
  if (!phone) {
    return NextResponse.json({ error: 'Missing phone' }, { status: 400 })
  }
  const geo = await getGeolocation()
  if (!geo) {
    return NextResponse.json({ error: 'Error al obtener IP' }, { status: 500 })
  }
  if (geo.security.vpn || geo.security.proxy || geo.security.tor) {
    return NextResponse.json({ error: 'No se permite el uso de VPN o Proxy' }, { status: 403 })
  }
  const paisDetectado = geo.country_code
  const idioma = paisDetectado === 'US' ? 'en' : 'es'

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
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ phone, pais: paisDetectado, idioma_preferido: idioma })
      .select('id')
      .single()

    if (createError || !newUser) {
      return NextResponse.json({ error: createError?.message || 'Failed to create user' }, { status: 500 })
    }

    user = newUser
  }

  // Crear response
  const response = NextResponse.json({
    success: true,
    user_id: user.id,
    phone,
  })

  response.cookies.set('user_id', user.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
