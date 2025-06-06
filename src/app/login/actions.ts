'use server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function sendOtp(phone: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: true
    }
  })
  return { error }
}
