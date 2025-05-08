// src/app/api/get-user-id/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('[get-user-id] headers:', req.headers)

  const user_id = req.cookies.get('user_id')?.value

  if (!user_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  return NextResponse.json({ user_id })
}
