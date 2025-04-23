// /src/components/AuthEmail.tsx
'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthEmail() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const sendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(`Error al enviar: ${error.message}`)
    } else {
      setMessage('📩 Revisa tu correo y haz clic en el link mágico.')
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Iniciar sesión por correo</h2>

      <input
        type="email"
        className="w-full border p-2 rounded text-black"
        placeholder="tucorreo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={sendOtp}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        Enviar código
      </button>

      {message && <p className="text-sm text-center text-gray-700">{message}</p>}
    </div>
  )
}
