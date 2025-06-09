import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { user_id, language } = await req.json()

  if (!user_id || !['es', 'en'].includes(language)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { error } = await supabase
    .from('users')
    .update({ preferred_language: language })
    .eq('id', user_id)

  if (error) {
    console.error('Supabase error al actualizar language:', error.message)
    return NextResponse.json({ error: 'Failed to update language' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
