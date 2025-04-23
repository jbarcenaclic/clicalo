import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'Falta user_id' }, { status: 400 })
    }

    const hoy = new Date().toISOString().split('T')[0]

    // Obtener todas las tiradas de hoy con sus acciones
    const { data: tiradasData, error } = await supabase
      .from('tiradas')
      .select('id, fecha, completada, acciones (id, completada)')
      .eq('user_id', userId)
      .eq('fecha', hoy)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!tiradasData || tiradasData.length === 0) {
      return NextResponse.json({ tiradasCompletadas: 0, accionesEnCurso: 0 })
    }

    const tiradasCompletadas = tiradasData.filter(t => t.completada).length

    const tiradaActiva = tiradasData.find(t => !t.completada)
    let accionesEnCurso = 0

    if (tiradaActiva && tiradaActiva.acciones) {
      const acciones = tiradaActiva.acciones
      const total = acciones.length
      const hechas = acciones.filter(a => a.completada).length

      if (total === 3 && hechas < 3 && hechas > 0) {
        accionesEnCurso = hechas + 1
      } else if (total === 3 && hechas === 0) {
        accionesEnCurso = 1
      }
    }

    return NextResponse.json({
      tiradasCompletadas,
      accionesEnCurso
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
