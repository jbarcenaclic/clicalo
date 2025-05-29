'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RegisterPage() {
  const [name, setName] = useState('')
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

    const { error } = await supabase.from('users').insert({ phone, name })

    if (error) {
      setError('Error al registrar el usuario.')
    } else {
      router.push('/tasks')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-800 text-white px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-blue-900">
        <h1 className="text-2xl font-bold mb-4">¡Bienvenido a CLÍCALO! 🎉</h1>
        <p className="mb-6">Registrando número: <span className="font-semibold">{phone}</span></p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">Tu nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu nombre"
            />
          </div>

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
              Acepto los <a href="/legal/terminos" className="underline text-blue-600 hover:text-blue-800">Términos y Condiciones</a> y el <a href="/legal/privacidad" className="underline text-blue-600 hover:text-blue-800">Aviso de Privacidad</a> de CLÍCALO.
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
    </div>
  )
}
