import CryptoJS from 'crypto-js'

const SECRET = process.env.NEXT_PUBLIC_TOKEN_SECRET_KEY!

export function firmarUserId(userId: string): string {
  const hash = CryptoJS.HmacSHA256(userId, SECRET)
  return hash.toString(CryptoJS.enc.Hex)
}
