import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { user_id, idioma } = await req.json()

  if (!user_id || !['es', 'en'].includes(idioma)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { error } = await supabase
    .from('users')
    .update({ idioma_preferido: idioma })
    .eq('id', user_id)

  if (error) {
    console.error('Supabase error al actualizar idioma:', error.message)
    return NextResponse.json({ error: 'Failed to update idioma' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
