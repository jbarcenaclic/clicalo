import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!)
  const tirada_id = searchParams.get('tirada_id')

  console.log('[next-action] tirada_id recibido:', tirada_id)

  const { data: accion, error } = await supabase
    .from('acciones')
    .select('*')
    .eq('tirada_id', tirada_id)
    .eq('completada', false)
    .order('orden', { ascending: true })
    .limit(1)

  if (error) {
    console.error('[next-action] ❌ Error en consulta:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!accion || accion.length === 0) {
    console.log('[next-action] ✅ No hay más acciones pendientes')
    return NextResponse.json({ action: null }, { status: 200 })
  }

  console.log('[next-action] ✅ Acción pendiente encontrada:', accion)

  return NextResponse.json({ action: accion [0] })
}
