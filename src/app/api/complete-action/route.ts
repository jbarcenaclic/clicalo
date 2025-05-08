// src/app/api/complete-action/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { crearSiguienteAccion } from '@/utils/crearSiguienteAccion'
import { calcularPayoutReal } from '@/utils/economia'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { valorVisible = 0.035, action_id, duration } = body

    console.log('>> Complete action:', { valorVisible, action_id, duration })

    if (!action_id) {
      return NextResponse.json({ error: 'Falta action_id' }, { status: 400 })
    }

    // 1. Buscar acción
    const { data: action, error: fetchError } = await supabase
      .from('acciones')
      .select('id, orden, tirada_id')
      .eq('id', action_id)
      .single()

    if (fetchError || !action) {
      return NextResponse.json({ error: 'Acción no encontrada' }, { status: 404 })
    }

    const realPayout = await calcularPayoutReal(action.tirada_id)

    // 2. Marcar como completada
    await supabase
      .from('acciones')
      .update({ completada: true, end_time: new Date() })
      .eq('id', action_id)

    console.log('>> Acción marcada como completada:', action_id)

    // 3. Guardar duración si aplica
    if (duration !== undefined) {
      await supabase.from('action_tracking').insert({ action_id, duration })
    }

    // 4. Obtener datos de la tirada (user_id y fecha)
    const { data: tiradaInfo, error: tiradaError } = await supabase
      .from('tiradas')
      .select('user_id, fecha')
      .eq('id', action.tirada_id)
      .single()

    if (tiradaError || !tiradaInfo) {
      return NextResponse.json({ error: 'Datos de tirada incompletos' }, { status: 400 })
    }

    const { user_id, fecha } = tiradaInfo

    // 5. Intentar crear siguiente acción si aplica
    const resultado = await crearSiguienteAccion(action.tirada_id, user_id)
    console.log('[complete-action] Resultado crearSiguienteAccion:', resultado)

    if (resultado === 'completada') {
      console.log('>> Tirada completada. Registrando earnings.')

      // Marcar tirada como completada
      await supabase
        .from('tiradas')
        .update({ completada: true, valor_visible: valorVisible })
        .eq('id', action.tirada_id)

      // Upsert en user_progress
      await supabase.from('user_progress').upsert({
        user_id,
        tiradas_hoy: 1,
        total_mes: valorVisible,
        last_update: new Date(),
      }, { onConflict: 'user_id' })

      // Upsert en user_earnings
      await supabase.from('user_earnings').upsert({
        user_id,
        fecha,
        visible_earnings: valorVisible,
        real_earnings: realPayout,
        tiradas_completadas: 1,
      }, { onConflict: 'user_id,fecha' })

      return NextResponse.json({ tirada_completada: true, payout: valorVisible })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[complete-action] Error general:', err)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
