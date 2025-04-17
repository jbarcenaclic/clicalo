import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const subscription = req.body

  const { endpoint, keys } = subscription
  const user_id = 'xxxx-xxx-uuid-mock' // Puedes ligarlo al número si está logueado

  const { error } = await supabase.from('push_subscriptions').insert({
    user_id,
    endpoint,
    keys,
  })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json({ success: true })
}
