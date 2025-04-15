import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action_id, duration } = req.body
  if (!action_id) return res.status(400).json({ error: 'Missing action_id' })

  // Mark action as completed
  const { data: action, error: fetchError } = await supabase
    .from('acciones')
    .select('id, orden, tirada_id')
    .eq('id', action_id)
    .single()
  if (fetchError || !action) return res.status(404).json({ error: 'Action not found' })

  await supabase
    .from('acciones')
    .update({ completada: true, end_time: new Date() })
    .eq('id', action_id)

  if (duration !== undefined) {
    await supabase.from('action_tracking').insert({ action_id, duration })
  }

  // Check if tirada is now fully completed
  const { data: pendientes } = await supabase
    .from('acciones')
    .select('*')
    .eq('tirada_id', action.tirada_id)
    .eq('completada', false)

  if (pendientes.length === 0) {
    // All actions completed → mark tirada and register payout
    const valorVisible = 0.035
    const { data: tirada } = await supabase
      .from('tiradas')
      .update({ completada: true, valor_visible: valorVisible })
      .eq('id', action.tirada_id)
      .select('user_id, fecha')
      .single()

    // Insert/update user_progress
    await supabase
      .from('user_progress')
      .upsert({
        user_id: tirada.user_id,
        tiradas_hoy: 1,
        total_mes: valorVisible,
        last_update: new Date(),
      }, { onConflict: 'user_id' })
      .select()

    // Insert/update user_earnings
    await supabase
      .from('user_earnings')
      .upsert({
        user_id: tirada.user_id,
        fecha: tirada.fecha,
        visible_earnings: valorVisible,
        real_earnings: valorVisible,
        tiradas_completadas: 1,
      }, { onConflict: 'user_id,fecha' })

    return res.status(200).json({ tirada_completada: true, payout: valorVisible })
  }

  res.status(200).json({ success: true })
}
