// src/app/error.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[CLÍCALO] error capturado:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-red-600 flex flex-col justify-center items-center text-white text-center px-4">
      <h1 className="text-6xl font-bold mb-4">💥 ¡Ups! Algo falló</h1>
      <p className="text-xl mb-6">
        Algo salió mal en el sistema.<br />
        Pero tranquilo, puedes intentarlo de nuevo o volver al inicio.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-white text-red-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
        >
          🔄 Intentar de nuevo
        </button>
        <Link
          href="/"
          className="bg-yellow-400 text-red-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition"
        >
          🏠 Ir al inicio
        </Link>
      </div>
    </div>
  )
}
