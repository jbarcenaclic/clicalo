// src/pages/api/start-tirada.ts

import { supabase } from '@/lib/supabaseClient'
import { NextApiRequest, NextApiResponse } from 'next'
import { getFechaLocal } from '@/lib/fechaLocal'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  // Obtener el user_id del cliente
  // En APIs, necesitas obtener user_id desde cookies o encabezados, NO con fetch
  const user_id = req.cookies['user_id'] // o usa alguna forma de validación JWT/session

  if (!user_id) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  console.log('[start-tirada] user_id:', user_id)
  if (!user_id) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  // Obtener la zona horaria del usuario

  const { data: userData } = await supabase
  .from('users')
  .select('timezone')
  .eq('id', user_id)
  .single()

  if (!userData) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  console.log('[start-tirada] timezone:', userData?.timezone)
  // Obtener la zona horaria del usuario

  const { fecha:fechaLocal, } = getFechaLocal(userData)

  console.log('[start-tirada] fecha local:', fechaLocal)
  // Obtener tiradas del día

  try {
    // 1. Buscar si ya hay una tirada incompleta hoy
    const { data: tiradaIncompleta, error: errorIncompleta } = await supabase
    .from('tiradas')
    .select('id')
    .eq('user_id', user_id)
    .eq('fecha', fechaLocal)
    .eq('completada', false)
    .limit(1)
    .maybeSingle()

    if (errorIncompleta) {
    console.error('[start-tirada] Error al buscar tirada incompleta:', errorIncompleta)
    return res.status(500).json({ error: 'Error al verificar tiradas incompletas' })
    }

    if (tiradaIncompleta) {
    console.log('[start-tirada] Reusando tirada incompleta existente:', tiradaIncompleta.id)
    return res.status(200).json({ tirada_id: tiradaIncompleta.id })
    }

    // 2. Contar cuántas tiradas completas e incompletas existen hoy
    const { data: tiradasHoy, error: errorTiradas } = await supabase
      .from('tiradas')
      .select('id', { count: 'exact' })
      .eq('user_id', user_id)
      .eq('fecha', fechaLocal)

    if (errorTiradas) {
      console.error('[start-tirada] Error al contar tiradas de hoy:', errorTiradas)
      return res.status(500).json({ error: 'Error al verificar tiradas' })
    }

    if (tiradasHoy && tiradasHoy.length >= 10) {
      console.log('[start-tirada] Usuario ya alcanzó 10 tiradas hoy')
      return res.status(429).json({ error: 'Ya alcanzaste el límite de 10 tiradas hoy' })
    }

    // 3. Crear nueva tirada
    const { data: nuevaTirada, error: errorCrear } = await supabase
      .from('tiradas')
      .insert([{ user_id, completada: false, fecha: fechaLocal  }])
      .select()
      .single()

    if (errorCrear || !nuevaTirada) {
      console.error('[start-tirada] Error al crear nueva tirada:', errorCrear)
      return res.status(500).json({ error: 'No se pudo crear la tirada' })
    }

    // 4. Responder con éxito
    return res.status(200).json({ tirada_id: nuevaTirada.id })

  } catch (error) {
    console.error('[start-tirada] Error general:', error)
    return res.status(500).json({ error: 'Error en el servidor' })
  }
}
