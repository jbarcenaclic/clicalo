import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id } = req.body
  console.log('[start-tirada] user_id recibido:', user_id)
  if (!user_id) {
    console.warn('[start-tirada] ❌ Falta user_id')
    return res.status(400).json({ error: 'Falta user_id' })
  }

  try {
    console.log('[start-tirada] ✅ Insertando tirada...')
    const { data: tirada, error: tiradaError } = await supabase
      .from('tiradas')
      .insert({ user_id, fecha: new Date().toISOString() })
      .select()
      .single();
  
    if (tiradaError) {
      console.error('[start-tirada] ❌ Error al insertar tirada:', tiradaError)
      throw tiradaError;
    }

    console.log('[start-tirada] ✅ Tirada insertada:', tirada)

    const acciones = [1, 2, 3].map((orden) => ({
      tirada_id: tirada.id,
      tipo: 'dummy',
      orden,
      completada: false,
    }))
  
    const { error: accionesError } = await supabase.from('acciones').insert(acciones)
    if (accionesError) {
      console.error('[start-tirada] ❌ Error al insertar acciones:', accionesError)
      return res.status(500).json({ error: accionesError.message })
    }
  
    console.log('[start-tirada] ✅ Acciones insertadas con éxito')
    return res.status(200).json({ tirada_id: tirada.id, fecha: tirada.fecha });
  } catch (err) {
    console.error('[start-tirada] ❌ Error inesperado:', err)
    return res.status(500).json({ error: 'Error interno al iniciar tirada' });
  }

}
