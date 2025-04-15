import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tirada_id } = req.query
  console.log('[next-action] tirada_id recibido:', tirada_id)
  if (!tirada_id) {
    console.warn('[next-action] ❌ Falta tirada_id')
    return res.status(400).json({ error: 'Falta tirada_id' })
  }
  try{
    console.log('[next-action] 🔍 Buscando acción pendiente...')
    const { data, error } = await supabase
      .from('acciones')
      .select('*')
      .eq('tirada_id', tirada_id)
      .eq('completada', false)
      .order('orden', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      console.error('[next-action] ❌ Error en consulta:', error.message)
      return res.status(404).json({ error: 'No se encontró acción pendiente' })
    }
    if (!data) {
      console.warn('[next-action] ⚠️ No hay acción pendiente para esta tirada')
      return res.status(404).json({ error: 'No hay acción pendiente' })
    }
    console.log('[next-action] ✅ Acción pendiente encontrada:', data)
    return res.status(200).json(data)
  } catch (err) {
    console.error('[next-action] ❌ Error inesperado:', err)
    return res.status(500).json({ error: 'Error al buscar siguiente acción' })
  }
}
