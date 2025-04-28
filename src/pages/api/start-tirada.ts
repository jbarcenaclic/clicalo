// src/pages/api/start-tirada.ts

import { supabase } from '@/lib/supabaseClient'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { user_id } = req.body

  if (!user_id) {
    return res.status(400).json({ error: 'Falta user_id' })
  }

  try {
    // 1. Validar cuántas tiradas lleva hoy este usuario
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: tiradasHoy, error: errorTiradas } = await supabase
      .from('tiradas')
      .select('id', { count: 'exact' })
      .eq('user_id', user_id)
      .gte('created_at', today.toISOString())

    if (errorTiradas) {
      console.error('[start-tirada] Error al contar tiradas de hoy:', errorTiradas)
      return res.status(500).json({ error: 'Error al verificar tiradas' })
    }

    if (tiradasHoy && tiradasHoy.length >= 10) {
      console.log('[start-tirada] Usuario ya alcanzó 10 tiradas hoy')
      return res.status(400).json({ error: 'Ya alcanzaste el límite de 10 tiradas hoy.' })
    }

    // 2. Crear nueva tirada
    const { data: nuevaTirada, error: errorCrear } = await supabase
      .from('tiradas')
      .insert([{ user_id, completada: false }])
      .select()
      .single()

    if (errorCrear || !nuevaTirada) {
      console.error('[start-tirada] Error al crear nueva tirada:', errorCrear)
      return res.status(500).json({ error: 'No se pudo crear la tirada' })
    }

    // 3. Crear 3 acciones para esta tirada
    const acciones = [
      { tirada_id: nuevaTirada.id, orden: 1 },
      { tirada_id: nuevaTirada.id, orden: 2 },
      { tirada_id: nuevaTirada.id, orden: 3 },
    ]

    const { error: errorAcciones } = await supabase
      .from('acciones')
      .insert(acciones)

    if (errorAcciones) {
      console.error('[start-tirada] Error al crear acciones:', errorAcciones)
      return res.status(500).json({ error: 'No se pudieron crear las acciones' })
    }

    // 4. Responder con éxito
    return res.status(200).json({ tirada_id: nuevaTirada.id })

  } catch (error) {
    console.error('[start-tirada] Error general:', error)
    return res.status(500).json({ error: 'Error en el servidor' })
  }
}
