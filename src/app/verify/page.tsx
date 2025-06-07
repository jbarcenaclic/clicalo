// src/app/verify/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'validating' | 'error' | 'success'>('validating')

  const phone = searchParams?.get('phone') || ''
  const otp = '123456'

  useEffect(() => {
    const verify = async () => {
      if (!phone) {
        setStatus('error')
        return
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms',
        })
        console.log('🔍 OTP verification response:', { data, error })

        if (error) {
          console.error('❌ Error OTP:', error.message)
          setStatus('error')
          return
        }

        console.log('✅ Sesión iniciada:', data)
        setStatus('success')
        router.push('/tasks')
      } catch (err) {
        console.error('❌ Error inesperado:', err)
        setStatus('error')
      }
    }

    verify()
  }, [phone, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
      <div className="max-w-md w-full text-center space-y-4">
        {status === 'validating' && <p className="text-blue-400">Verificando código OTP…</p>}
        {status === 'success' && <p className="text-green-400">¡Verificación exitosa!</p>}
        {status === 'error' && (
          <>
            <p className="text-red-400">Error al verificar. Intenta nuevamente.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Volver a iniciar
            </button>
          </>
        )}
      </div>
    </div>
  )
}
