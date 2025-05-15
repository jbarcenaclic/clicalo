// src/app/api/next-action/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
//import { obtenerAccionDeBitLabs } from '@/lib/bitlabs'
import { crearSiguienteAccion } from '@/utils/crearSiguienteAccion'
import { cookies } from 'next/headers'


export async function POST( req: Request ) {
  const { tirada_id } = await req.json()
  console.log('>> Next action:', { tirada_id })

  if (!tirada_id) {
    return NextResponse.json({ error: 'Falta tirada_id' }, { status: 400 })
  }
  // Obtener el user_id del cliente

  const cookieStore = await cookies()
  const user_id = cookieStore.get('user_id')?.value
  

  if (!user_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  console.log('[next-action] user_id:', user_id)
  if (!user_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { data: accionesTirada, error } = await supabase
    .from('acciones')
    .select('*')
    .eq('tirada_id', tirada_id)
    .order('orden', { ascending: false })

  if (error || !accionesTirada) {
    console.error('[next-action] ❌ Error en consulta:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const accionesTotales = accionesTirada.length
  const accionesCompletadas = accionesTirada.filter(a => a.completada).length

  if (accionesTotales == accionesCompletadas && accionesTotales >= 3) {
    console.log('[next-action] ❌ Todas las acciones completadas, no se puede crear nueva acción.')
    return NextResponse.json({ action: null })
  }

  if (accionesTotales - accionesCompletadas > 0) {
    console.log('[next-action] ✅ Hay acciones pendientes, buscando la más reciente...')
    const accionPendiente = accionesTirada.find(a => !a.completada)
    if (accionPendiente) {
      console.log('[next-action] ✅ Acción pendiente encontrada:', accionPendiente.id)
      return NextResponse.json({ action: accionPendiente })
    }
  }

  if (accionesTirada.length === 0 || (accionesCompletadas === accionesTotales && accionesTotales < 3)) {
    console.log('[next-action] No hay acciones pendientes, intentando crear nueva...')
  
    const resultado = await crearSiguienteAccion(tirada_id, user_id)
    console.log(`[next-action] Resultado crearSiguienteAccion: ${resultado}`)
  
    // Buscar nueva acción pendiente creada
    const { data: nuevasAcciones } = await supabase
      .from('acciones')
      .select('*')
      .eq('tirada_id', tirada_id)
      .order('orden', { ascending: false })
  
    const nuevaPendiente = nuevasAcciones?.find(a => !a.completada)
  
    if (nuevaPendiente) {
      console.log('[next-action] ✅ Acción nueva pendiente encontrada:', nuevaPendiente.id)
      return NextResponse.json({ action: nuevaPendiente })
    }
  
    console.warn('[next-action] ⚠️ No se pudo crear acción nueva')
    return NextResponse.json({ action: null })
  }
  
  console.log('[next-action] ✅ Acción pendiente encontrada:', accionesTirada[0].id)

  return NextResponse.json({ action: accionesTirada [0] })
}
