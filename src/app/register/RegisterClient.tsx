// src/app/register/RegisterClient.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useLogin } from '@/context/LoginContext'
import { texts } from '@/i18n/texts'

export default function RegisterPage() {
  const [modal, setModal] = useState<'terms' | 'privacy' | null>(null)
  const { preferred_language } = useLogin()
  const t = texts[preferred_language || 'es']
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  if (!searchParams) {
    return <p>Error: No se pudo obtener el número de teléfono.</p>
  }
  const phone = searchParams.get('phone') || ''

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
  
    if (!accepted) {
      setError('⚠️ Debes aceptar los Términos y Condiciones antes de continuar.')
      return
    }

    const isDev = process.env.NODE_ENV !== 'production'

    if (isDev) {
      const response = await fetch('/api/dev-create-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
        headers: { 'Content-Type': 'application/json' },
      })
    
      if (!response.ok) {
        console.error('❌ Error simulando OTP:', await response.text())
        setError('Error simulando OTP')
        return
      }
    
      console.log('✅ OTP simulado correctamente')
    }
  
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: true }
      })
      
      if (error) {
        console.warn('OTP error (ignorado en dev):', error.message)
      }
    } catch (err) {
      console.error('Error inesperado:', err)
    }
  
    router.push(`/verify?phone=${encodeURIComponent(phone)}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-blue-900">
        {process.env.NODE_ENV !== 'production' && (
          <div className="mb-4 text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-3 text-center">
            ⚠️ Estás en <strong>modo desarrollo</strong>. El registro y verificación se simulan con un OTP <strong>fijo: 123456</strong>.
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">¡Bienvenido a CLÍCALO! 🎉</h1>
        <p className="mb-6">Registrando número: <span className="font-semibold">{phone}</span></p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex items-start space-x-2 text-sm">
            <input
              type="checkbox"
              id="terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
              required
            />
            <label htmlFor="terms" className="text-blue-800">
              {t.register_accept_terms_start}
              <span
                onClick={() => setModal('terms')}
                className="underline text-blue-600 cursor-pointer"
              >
                {t.register_accept_terms_link_terms}
              </span>
              {t.register_accept_terms_middle}
              <span
                onClick={() => setModal('privacy')}
                className="underline text-blue-600 cursor-pointer"
              >
                {t.register_accept_terms_link_privacy}
              </span>
              {t.register_accept_terms_end}
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 rounded-lg transition duration-200"
          >
            Registrarse
          </button>

          {error && (
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          )}
        </form>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-blue-900 rounded-xl max-w-lg w-full p-6 relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-sm text-blue-700 underline"
              onClick={() => setModal(null)}
            >
              {t.close}
            </button>
            <iframe
              src={
                modal === 'terms'
                  ? `/legal/terms.${preferred_language || 'es'}.html`
                  : `/legal/privacy.${preferred_language || 'es'}.html`
              }
              className="w-full h-[400px] mt-4 rounded border"
              title="Legal"
              sandbox="allow-same-origin allow-scripts"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  )
}
