import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tirada_id } = req.query
  if (!tirada_id) return res.status(400).json({ error: 'Falta tirada_id' })

  const { data, error } = await supabase
    .from('acciones')
    .select('*')
    .eq('tirada_id', tirada_id)
    .eq('completada', false)
    .order('orden', { ascending: true })
    .limit(1)
    .single()

  if (error || !data) {
    return res.status(200).json({ action: null })
  }
    

  res.status(200).json({ action: data })

}
