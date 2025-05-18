import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const user_id = searchParams.get('user_id')
  const rewardParam = searchParams.get('reward') // ✅ nombre correcto
  const reward = parseFloat(rewardParam || '0')

  if (!user_id || reward <= 0) {
    return new NextResponse('Missing or invalid parameters', { status: 400 })
  }

  const fecha = new Date().toISOString().split('T')[0]

  const { error } = await supabase.from('user_earnings').insert({
    user_id,
    fecha, // 👈 usar nombre correcto
    real_earnings: reward,
    visible_earnings: reward,
    tiradas_completadas: 0
  })
  

  if (error) {
    console.error('[❌] Error guardando recompensa:', error)
    return new NextResponse('Error al guardar recompensa', { status: 500 })
  }

  console.log('[✅] Callback registrado:', { user_id, reward })
  return new NextResponse('OK', { status: 200 })
}
