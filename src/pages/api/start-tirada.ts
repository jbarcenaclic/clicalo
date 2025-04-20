import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id } = req.body
  console.log('[START] start-tirada.ts llamado con user_id:', user_id)

  if (!user_id) {
    console.log('[ERROR] user_id no proporcionado.')
    return res.status(400).json({ error: 'Missing user_id' })
  }

  // Paso 1: Obtener tirada activa existente para hoy
  const hoy = new Date().toISOString().split('T')[0]

  const { data: tiradaExistente } = await supabase
    .from('tiradas')
    .select('id')
    .eq('user_id', user_id)
    .eq('fecha', hoy)
    .eq('completada', false)
    .limit(1)
    .single()

  // Si ya existe una, devuélvela directamente
  if (tiradaExistente) {
    console.log('[OK] Tirada existente encontrada:', tiradaExistente.id)
    return res.status(200).json({ tirada_id: tiradaExistente.id })
  }
  console.log('[OK] No se encontró tirada existente, creando una nueva...')
  // Crear tirada
  const { data: tirada, error: tiradaError } = await supabase
    .from('tiradas')
    .insert({ user_id })
    .select()
    .single()

  if (tiradaError) {
    console.error('[ERROR] No se pudo crear la tirada:', tiradaError.message)
    return res.status(500).json({ error: tiradaError.message })
  }

  console.log('[OK] Tirada creada con ID:', tirada.id)

  // Crear 3 acciones dummy
  const acciones = [1, 2, 3].map((orden) => ({
    tirada_id: tirada.id,
    tipo: 'dummy',
    orden,
    completada: false,
  }))

  const { error: accionesError } = await supabase.from('acciones').insert(acciones)

  if (accionesError) {
    console.error('[ERROR] No se pudieron insertar las acciones:', accionesError.message)
    return res.status(500).json({ error: accionesError.message })
  }

  console.log('[OK] Acciones insertadas correctamente para tirada:', tirada.id)
  res.status(200).json({ tirada_id: tirada.id })
}
