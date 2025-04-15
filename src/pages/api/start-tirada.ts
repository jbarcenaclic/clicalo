import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id } = req.body
  if (!user_id) return res.status(400).json({ error: 'Falta user_id' })

  try {
    const { data: tirada, error: tiradaError } = await supabase
      .from('tiradas')
      .insert({ user_id, fecha: new Date().toISOString() })
      .select()
      .single();
  
    if (tiradaError) throw tiradaError;
  
    return res.status(200).json({ tirada_id: tirada.id, fecha: tirada.fecha });
  } catch (err) {
    console.error('Error en start-tirada:', err);
    return res.status(500).json({ error: 'Error interno al iniciar tirada' });
  }

  const acciones = [1, 2, 3].map((orden) => ({
    tirada_id: tirada.id,
    tipo: 'dummy',
    orden,
    completada: false,
  }))

  const { error: accionesError } = await supabase.from('acciones').insert(acciones)
  if (accionesError) return res.status(500).json({ error: accionesError.message })

  res.status(200).json({ tirada_id: tirada.id })
}
