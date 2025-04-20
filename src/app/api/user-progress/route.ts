//api/user-progress/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { toZonedTime, format } from 'date-fns-tz'



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
  
  // Obtener tiradas del día
  const { data: tiradas } = await supabase
    .from('tiradas')
    .select('id, completada')
    .eq('user_id', userId)
    .eq('fecha', fechaLocal)

  // IDs de tiradas del día
  const tiradasIds = tiradas?.map(t => t.id) || []

  // Acciones por tirada
  const { data: acciones } = await supabase
    .from('acciones')
    .select('tirada_id, completada')

  const accionesPorTirada = new Map<string, boolean[]>()

  // Agrupar acciones por tirada

  for (const accion of acciones || []) {
    if (!accionesPorTirada.has(accion.tirada_id)) {
      accionesPorTirada.set(accion.tirada_id, [])
    }
    accionesPorTirada.get(accion.tirada_id)!.push(accion.completada)
  }

  let tiradasCompletadas = 0
  let accionesEnCurso = 0

  for (const [tiradaId, completadas] of accionesPorTirada.entries()) {
    const total = completadas.length
    const hechas = completadas.filter(c => c).length
  
    if (total === 3 && hechas === 3) {
      tiradasCompletadas++
    } else if (total === 3 && hechas < 3 && hechas > 0) {
      accionesEnCurso = hechas + 1 // estamos en la siguiente acción
    } else if (total === 3 && hechas === 0) {
      accionesEnCurso = 1 // tirada recién iniciada
    }
  }

  return NextResponse.json({ tiradasCompletadas, accionesEnCurso }, { status: 200 })

  
}
