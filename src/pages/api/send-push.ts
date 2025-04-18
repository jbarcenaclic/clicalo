import type { NextApiRequest, NextApiResponse } from 'next'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

webpush.setVapidDetails(
  'mailto:push@clicalo.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, keys')

  if (error) {
    console.error('❌ Error fetching subs:', error.message)
    return res.status(500).json({ error: 'Failed to fetch subscriptions' })
  }

  let success = 0
  let fail = 0

  for (const sub of subs ?? []) {
    try {
      await webpush.sendNotification(sub, JSON.stringify({
        title: '🎯 Hoy puedes hacer tus 10 tiradas',
        body: 'No pierdas tu recompensa diaria. ¡Haz clic para empezar!',
        icon: '/favicon-192x192.png',
      }))
      success++
    } catch (err) {
      console.error('❌ Falló una notificación:', err)
      fail++
    }
  }

  res.status(200).json({ sent: success, failed: fail })
}
