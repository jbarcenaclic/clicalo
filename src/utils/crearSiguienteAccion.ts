// src/utils/crearSiguienteAccion.ts
import { supabase } from '@/lib/supabaseClient'
import { obtenerAccionDeRed } from '@/lib/asignacion'
import { AccionAsignada } from '@/types/Action'

export async function crearSiguienteAccion(tirada_id: string, user_id: string): Promise<'generada' | 'completada' | 'omitida'> {

  // 1. Obtener acciones actuales
  const { data: acciones, error: errorAcciones } = await supabase
    .from('acciones')
    .select('*')
    .eq('tirada_id', tirada_id)

  if (errorAcciones) {
    console.error('❌ Error obteniendo acciones:', errorAcciones)
    return 'omitida'
  }

  const completadas = acciones?.filter(a => a.completada) || []
  const pendientes = acciones?.filter(a => !a.completada) || []

  console.log('[crearSiguienteAccion] ✅ Acciones completadas:', completadas)
  console.log('[crearSiguienteAccion] ✅ Acciones pendientes:', pendientes)

  if (completadas.length >= 3) return 'completada'
  if (pendientes.length > 0) return 'omitida'

  console.log('[crearSiguienteAccion] ✅ creando nueva acción...')

  const orden = completadas.length + 1

  // 2. Intentar obtener acción de red
  const accion: AccionAsignada | null = await obtenerAccionDeRed(user_id)
  if (!accion) {
    console.warn('[crearSiguienteAccion] ❌ No se pudo obtener acción de red')
    return 'omitida'
  }
  console.log('[crearSiguienteAccion] ✅ Acción de red obtenida:', accion)
  // 2.1. Insertar acción de red

  if (accion) {
    const { data, error } = await supabase.from('acciones').insert([{
      tirada_id,
      tipo: accion.tipo,
      network: accion.network,
      external_id: accion.campaign_id,
      url_inicio: accion.url,
      payout_estimado: accion.payout,
      orden
    }])

    if (error) {
      console.error('[crearSiguienteAccion] ❌ Error insertando acción de red:', error)
      return 'omitida'
    }

    console.log('[crearSiguienteAccion] ✅ Acción BitLabs insertada:', data)
    return 'generada'
  }

  // 3. Fallback: acción local

  console.log('✅ Acción local insertada')
  return 'generada'
}
