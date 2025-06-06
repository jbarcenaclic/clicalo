'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const phone = searchParams?.get('phone') || ''
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const verify = async () => {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, token }),
    })

    if (res.ok) {
      router.push('/debug-test')
    } else {
      const { error } = await res.json()
      setMessage(error.message)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-2">Verifica tu código</h1>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="123456"
        className="border p-2 mb-2 block"
      />
      <button onClick={verify} className="bg-green-500 text-white px-4 py-2 rounded">
        Verificar
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}
