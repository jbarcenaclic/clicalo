import crypto from 'crypto'

const SECRET = process.env.TOKEN_SECRET_KEY!

export function firmarUserId(userId: string): string {
  return crypto.createHmac('sha256', SECRET).update(userId).digest('hex')
}

export function verificarFirma(userId: string, firma: string): boolean {
  console.log('>> Verificando firma:', { userId, firma })
  const hashEsperado = firmarUserId(userId)
  console.log('>> Verificando firma:', { hashEsperado, firma })
  try {
    return crypto.timingSafeEqual(
      Buffer.from(firma),
      Buffer.from(hashEsperado)
    )
  } catch {
    return false // fallback si firmas de distinto tamaño
  }
}
