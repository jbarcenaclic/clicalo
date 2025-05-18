import { NextResponse } from 'next/server'
import { obtenerAccionDeBitLabs } from '@/lib/bitlabs'

export async function GET() {
  const testUserId = 'Clicalo'

  const accion = await obtenerAccionDeBitLabs(testUserId)

  if (!accion) {
    return NextResponse.json(
      { error: 'No se pudo obtener acción de BitLabs' },
      { status: 500 }
    )
  }

  return NextResponse.json({ accion })
}
