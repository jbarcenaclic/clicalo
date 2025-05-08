// src/pages/api/set-cookie.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = serialize('user_id', 'abc123', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: '/',
    sameSite: 'lax',
    // secure: true, // ❌ NO en localhost
  })
  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ success: true })
}
