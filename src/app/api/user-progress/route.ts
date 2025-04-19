import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json({ error: 'Falta user_id' }, { status: 400 })
  }

  // Obtener tiradas con acciones
  const { data, error } = await supabase
    .from('tiradas')
    .select('id, completada, acciones(id, completada)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error || !data) {
    return NextResponse.json({ error: 'Error al obtener tiradas' }, { status: 500 })
  }

  // Calcular tiradas completas (todas sus acciones completadas)
  const tiradasCompletadas = data.filter((tirada) =>
    tirada.acciones?.every((a: any) => a.completada)
  ).length

  const tiradasTotales = data.length

  // Buscar la tirada en curso (la primera con alguna acción incompleta)
  const tiradaActiva = data.find((tirada) =>
    tirada.acciones?.some((a: any) => !a.completada)
  )

  const accionesEnCurso = tiradaActiva
    ? tiradaActiva.acciones.filter((a: any) => a.completada).length
    : 0

  return NextResponse.json({
    tiradasTotales,
    tiradasCompletadas,
    accionesEnCurso,
  })
}
