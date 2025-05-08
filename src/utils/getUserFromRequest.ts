import { NextRequest } from 'next/server'
import { verificarFirma } from './auth'

export async function getUserFromRequest(req: NextRequest): Promise<string> {
  let user_id: string | undefined
  let sig: string | undefined

  // Si viene por POST JSON
  if (req.method === 'POST') {
    const body = await req.json()
    user_id = body.user_id
    sig = body.sig
  } else {
    // Si viene por GET query
    const url = new URL(req.url)
    user_id = url.searchParams.get('user_id') ?? undefined
    sig = url.searchParams.get('sig') ?? undefined
  }

  if (!user_id || !sig || !verificarFirma(user_id, sig)) {
    throw new Error('Firma inválida o user_id faltante')
  }

  return user_id
}
