import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone } = req.body
  console.log('[START] start-tirada.ts llamado con:', phone)

  if (!phone) {
    console.log('[ERROR] Teléfono no proporcionado.')
    return res.status(400).json({ error: 'Missing phone number' })
  }

  // Buscar usuario
  console.log('[INFO] Buscando usuario por teléfono...')
  let { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('phone', phone)
    .single()

  if (findError) {
    console.log('[INFO] Usuario no encontrado. Se intentará crear uno nuevo.')
  } else {
    console.log('[OK] Usuario encontrado:', user?.id)
  }

  // Crear usuario si no existe
  if (!user) {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ phone })
      .select('id')
      .single()

    if (insertError || !newUser) {
      console.error('[ERROR] No se pudo crear el usuario:', insertError?.message)
      return res.status(500).json({ error: 'Could not create user' })
    }

    user = newUser
    console.log('[OK] Usuario nuevo creado con ID:', user.id)
  }

  // Crear tirada
  console.log('[INFO] Creando tirada...')
  const { data: tirada, error: tiradaError } = await supabase
    .from('tiradas')
    .insert({ user_id: user.id })
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

  console.log('[INFO] Insertando acciones dummy...')
  const { error: accionesError } = await supabase.from('acciones').insert(acciones)

  if (accionesError) {
    console.error('[ERROR] No se pudieron insertar las acciones:', accionesError.message)
    return res.status(500).json({ error: accionesError.message })
  }

  console.log('[OK] Acciones insertadas correctamente.')
  res.status(200).json({ tirada_id: tirada.id })
}
