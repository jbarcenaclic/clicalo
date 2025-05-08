import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set('user_id', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // Elimina la cookie
  })

  return response
}
