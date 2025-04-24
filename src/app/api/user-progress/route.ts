// app/api/user-progress/route.ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'
import { toZonedTime, format } from 'date-fns-tz'

export async function GET(req: Request) {
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

    console.log('[user-progress] timezone:', userData?.timezone)
    // Obtener la zona horaria del usuario

    const timezone = userData?.timezone || 'America/Mexico_City'
    const ahora = new Date()
    const zonedDate = toZonedTime(ahora, timezone)
    const fechaLocal = format(zonedDate, 'yyyy-MM-dd')
    
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
      return {
        tiradasCompletadas: 0,
        accionesEnCurso: 0,
      }
    }

    // 2. Identificar cuántas están completadas
    const tiradasCompletadas = tiradasData.filter(t => t.completada).length

    // 3. Buscar la tirada activa (no completada)
    const tiradaActiva = tiradasData.find(t => !t.completada)
    let accionesEnCurso = 0

    if (tiradaActiva && tiradaActiva.acciones) {
      const acciones = tiradaActiva.acciones
      const totalAcciones = acciones.length
      const hechas = acciones.filter(a => a.completada).length

      if (totalAcciones === 3 && hechas < 3 && hechas > 0) {
        accionesEnCurso = hechas + 1
      } else if (totalAcciones === 3 && hechas === 0) {
        accionesEnCurso = 1
      }
    }
    console.log('[user-progress] tiradasCompletadas:', tiradasCompletadas)
    console.log('[user-progress] accionesEnCurso:', accionesEnCurso)

    return NextResponse.json({ tiradasCompletadas, accionesEnCurso }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
}
