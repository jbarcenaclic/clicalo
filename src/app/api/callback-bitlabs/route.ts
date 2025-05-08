// src/app/api/callback-bitlabs/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  const payout = searchParams.get('payout')
  const transaction_id = searchParams.get('transaction_id')

  if (!user_id || !payout || !transaction_id) {
    return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 })
  }

  try {
    // 1. Buscar acción pendiente con ese external_id
    const { data: acciones, error: findError } = await supabase
      .from('acciones')
      .select('*')
      .eq('user_id', user_id)
      .eq('external_id', transaction_id)
      .eq('network', 'BitLabs')
      .eq('completada', false)
      .limit(1)

    if (findError || !acciones || acciones.length === 0) {
      return NextResponse.json({ error: 'Acción no encontrada o ya completada' }, { status: 404 })
    }

    const accion = acciones[0]

    // 2. Marcar como completada
    const { error: updateError } = await supabase
      .from('acciones')
      .update({
        completada: true,
        payout_real: parseFloat(payout),
        fecha_completado: new Date().toISOString(),
        end_time: new Date().toISOString()
      })
      .eq('id', accion.id)

    if (updateError) {
      console.error('Error actualizando acción:', updateError)
      return NextResponse.json({ error: 'No se pudo actualizar acción' }, { status: 500 })
    }

    // 3. Verificar si ya se completaron 3 acciones en esta tirada
    const { data: accionesTirada } = await supabase
      .from('acciones')
      .select('id')
      .eq('tirada_id', accion.tirada_id)
      .eq('completada', true)

    if (accionesTirada && accionesTirada.length >= 3) {
      await supabase
        .from('tiradas')
        .update({ completada: true })
        .eq('id', accion.tirada_id)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (e) {
    console.error('Error general en callback:', e)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
