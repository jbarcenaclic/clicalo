// src/app/not-found.tsx
'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-clicalo-azul flex flex-col justify-center items-center text-white text-center px-4">
      <h1 className="text-6xl font-bold mb-4">🚫 Página no encontrada</h1>
      <p className="text-xl mb-6">
        Parece que hiciste clic donde no había clic 🤔<br />
        Pero no te preocupes, ¡todo suma!
      </p>
      <Link
        href="/"
        className="bg-yellow-400 text-clicalo-azul font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition"
      >
        🔁 Regresar al inicio
      </Link>
    </div>
  )
}
