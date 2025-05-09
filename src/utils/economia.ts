// src/utils/economia.ts
import { createClient } from '@supabase/supabase-js'


export async function calcularPayoutReal(tirada_id: string): Promise<number> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: acciones, error } = await supabase
    .from('acciones')
    .select('payout_real, payout_estimado')
    .eq('tirada_id', tirada_id)
    .eq('completada', true)

  if (error || !acciones) {
    console.error('❌ Error obteniendo acciones completadas:', error)
    return 0
  }

  const total = acciones.reduce((sum, a) => {
    const payout = a.payout_real ?? a.payout_estimado ?? 0
    return sum + payout
  }, 0)

  return parseFloat(total.toFixed(4)) // precisión de 4 decimales
}
