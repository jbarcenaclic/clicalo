// src/utils/crearSiguienteAccion.ts
import { supabase } from '@/lib/supabaseClient'
import { obtenerAccionDeBitLabs } from '@/lib/bitlabs'


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

  if (completadas.length >= 3) return 'completada'
  if (pendientes.length > 0) return 'omitida'

  const orden = completadas.length + 1

  // 2. Intentar obtener acción de BitLabs
  const accion = await obtenerAccionDeBitLabs(user_id)

  if (accion) {
    const { data, error } = await supabase.from('acciones').insert([{
      tirada_id,
      tipo: 'encuesta',
      network: 'BitLabs',
      external_id: accion.campaign_id,
      url_inicio: accion.url,
      payout_estimado: accion.payout,
      orden
    }])

    if (error) {
      console.error('❌ Error insertando acción BitLabs:', error)
      return 'omitida'
    }

    console.log('✅ Acción BitLabs insertada:', data)
    return 'generada'
  }

  // 3. Fallback: acción local

  const { error: errorLocal } = await supabase.from('acciones').insert([{
    tirada_id,
    tipo: 'trivia',
    network: 'Local',
    external_id: null,
    url_inicio: `/juego-trivia-local?action_id=${tirada_id}`,
    payout_estimado: 0.02,
    orden
  }])

  if (errorLocal) {
    console.error('❌ Error insertando acción local:', errorLocal)
    return 'omitida'
  }

  console.log('✅ Acción local insertada')
  return 'generada'
}
