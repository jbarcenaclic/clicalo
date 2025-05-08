// src/app/api/next-action/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { obtenerAccionDeBitLabs } from '@/lib/bitlabs'
import { verificarFirma } from '@/utils/auth'
import { crearSiguienteAccion } from '@/utils/crearSiguienteAccion'


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!)
  const user_id = searchParams.get('user_id')
  const tirada_id = searchParams.get('tirada_id')
  const sig = searchParams.get('sig')
  console.log('[next-action] user_id recibido:', user_id)
  console.log('[next-action] sig recibido:', sig)
  console.log('[next-action] tirada_id recibido:', tirada_id)
  

  if (!user_id || !tirada_id || !sig) {
    return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 })
  }
  if (!verificarFirma(user_id, sig)) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
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
