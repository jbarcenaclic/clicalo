// app/api/user-progress/route.ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'
import { getFechaLocal } from '@/lib/fechaLocal'

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'Falta user_id' }, { status: 400 })
    }

    // Supón que ya tienes el userId
    const { data: userData } = await supabase
      .from('users')
      .select('timezone')
      .eq('id', userId)
      .single()

  if (!userData) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  console.log('[user-progress] timezone:', userData?.timezone)
  // Obtener la zona horaria del usuario

  const { fecha:fechaLocal, hora } = getFechaLocal(userData)

  console.log('[user-progress] fecha local:', fechaLocal)
  // Obtener tiradas del día
    
    const { data: tiradasData, error } = await supabase
    .from('tiradas')
    .select('id, fecha, completada, acciones (id, completada)')
    .eq('user_id', userId)
    .eq('fecha', fechaLocal)
    .order('created_at', { ascending: false }) // por si hay más de una, prioriza la más reciente

    if (error) {
      console.error('[user-progress] Error al obtener tiradas:', error)
      return NextResponse.json({ error: 'Error al obtener tiradas' }, { status: 500 })
    }
    console.log('[user-progress] tiradas:', tiradasData)

    if (!tiradasData || tiradasData.length === 0) {
      return NextResponse.json({ tiradasCompletadas: 0, accionesEnCurso: 0 }, { status: 500 })
    }

    // 2. Identificar cuántas están completadas
    const tiradasCompletadas = tiradasData.filter(t => t.completada).length
    const tiradaActiva = tiradasData.find(t => !t.completada)

    let accionesEnCurso = 0
    let accionesTotales = 0
    let accionesHechas = 0
    let tiradaActivaId = null

    if (tiradaActiva && tiradaActiva.acciones) {
      const acciones = tiradaActiva.acciones
      accionesTotales = acciones.length
      accionesHechas = acciones.filter(a => a.completada).length
      tiradaActivaId = tiradaActiva.id

      if (accionesTotales >= 1 && accionesHechas < accionesTotales) {
        accionesEnCurso = accionesHechas + 1
      }
    }

    console.log('[user-progress] tiradasCompletadas:', tiradasCompletadas)
    console.log('[user-progress] accionesEnCurso:', accionesEnCurso)

    return NextResponse.json({
      tiradasCompletadas,
      accionesEnCurso,
      tiradaActivaId,
      accionesTotales,
      accionesHechas,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
}
