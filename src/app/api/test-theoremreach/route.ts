import { NextResponse } from 'next/server'
import { obtenerAccionDeTheoremReach } from '@/lib/theoremreach'

export async function GET() {
  const testUserId = 'test_user_abc'

  const accion = await obtenerAccionDeTheoremReach(testUserId)

  if (!accion) {
    return NextResponse.json(
      { error: 'No se pudo obtener acción de TheoremReach' },
      { status: 500 }
    )
  }

  return NextResponse.json({ accion })
}
