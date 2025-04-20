// src/components/PushSubscription.tsx
'use client'

import { useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function PushSubscription() {
  useEffect(() => {
    const run = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey || !('serviceWorker' in navigator)) return

      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js')
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        const existing = await reg.pushManager.getSubscription()
        if (existing) return

        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey,
        })

        if (!localStorage.getItem('push_subscribed')) {
          await fetch('/api/save-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
            credentials: 'include'
          })

          localStorage.setItem('push_subscribed', '1')
        }
      } catch (err) {
        console.error('❌ Push error:', err)
      }
    }

    run()
  }, [])

  return null
}
