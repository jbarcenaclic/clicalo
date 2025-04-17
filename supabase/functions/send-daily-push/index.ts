import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import webpush from "https://esm.sh/web-push"

console.log("🔔 Edge Function send-daily-push initialized")

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!
  const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!

  webpush.setVapidDetails(
    "mailto:push@clicalo.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  )

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, keys")

  if (error) {
    console.error("❌ Error fetching subs:", error.message)
    return new Response("Error", { status: 500 })
  }

  let successCount = 0
  for (const sub of subs ?? []) {
    try {
      await webpush.sendNotification(sub, JSON.stringify({
        title: "🎯 Hoy puedes hacer tus 10 tiradas",
        body: "No pierdas tu recompensa diaria. ¡Haz clic para empezar!",
        icon: "/favicon-192x192.png",
      }))
      successCount++
    } catch (err) {
      console.error("Error al enviar a:", sub.endpoint, err)
    }
  }

  return new Response(`✅ Notificaciones enviadas: ${successCount}`)
})
