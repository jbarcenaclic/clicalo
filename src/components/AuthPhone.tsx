// /src/components/AuthPhone.tsx

'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthPhone() {
  const [step, setStep] = useState<'phone' | 'verify'>('phone')
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')

  const sendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) {
      setMessage(`Error al enviar código: ${error.message}`)
    } else {
      setMessage('Código enviado. Revisa tu SMS.')
      setStep('verify')
    }
  }

  const verifyOtp = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    })

    if (error) {
      setMessage(`Código inválido: ${error.message}`)
    } else {
      setMessage('✅ Teléfono verificado. Redirigiendo...')
      window.location.href = '/' // o cualquier ruta protegida
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>

      {step === 'phone' && (
        <>
          <input
            type="tel"
            className="w-full border p-2 rounded"
            placeholder="Teléfono (con código país)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={sendOtp} className="bg-blue-600 text-white w-full py-2 rounded">
            Enviar código
          </button>
        </>
      )}

      {step === 'verify' && (
        <>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Código recibido por SMS"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={verifyOtp} className="bg-green-600 text-white w-full py-2 rounded">
            Verificar
          </button>
        </>
      )}

      {message && <p className="text-sm text-center text-gray-700">{message}</p>}
    </div>
  )
}

