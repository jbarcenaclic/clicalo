import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get('user_id')

  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('tiradas_hoy, total_mes')
    .eq('user_id', user_id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
