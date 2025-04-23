import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'
import { toZonedTime, format } from 'date-fns-tz'

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


  // Supón que ya tienes el userId
  const { data: userData } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', user_id)
    .single()

  console.log('[user-progress] timezone:', userData?.timezone)
  // Obtener la zona horaria del usuario

  const timezone = userData?.timezone || 'America/Mexico_City'
  const ahora = new Date()
  const zonedDate = toZonedTime(ahora, timezone)
  const fechaLocal = format(zonedDate, 'yyyy-MM-dd')
  
  console.log('[user-progress] fecha local:', fechaLocal)
  // Obtener tiradas del día

  // Paso 1: Obtener tirada activa existente para hoy
  const hoy = new Date().toISOString().split('T')[0]

  const { data: tiradaExistente } = await supabase
    .from('tiradas')
    .select('id')
    .eq('user_id', user_id)
    .eq('fecha', hoy)
    .eq('completada', false)
    .eq('fecha', fechaLocal)
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
