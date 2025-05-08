// src/app/api/user-info/route.ts
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const user_id = req.cookies.get('user_id')?.value
  if (!user_id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await supabase
    .from('users')
    .select('phone')
    .eq('id', user_id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No se encontró el usuario' }, { status: 404 })
  }

  return NextResponse.json({ user_id, phone: data.phone })
}
