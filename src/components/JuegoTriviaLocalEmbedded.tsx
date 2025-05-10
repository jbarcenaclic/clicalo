'use client'
import { useState } from 'react'

export default function JuegoTriviaLocalEmbedded({
  actionId,
  onComplete
}: {
  actionId: string
  onComplete: () => void
}) {
  const [respuesta, setRespuesta] = useState<string | null>(null)
  const [completada, setCompletada] = useState(false)

  const opciones = [
    { texto: 'Ciudad de México', correcta: true },
    { texto: 'Guadalajara', correcta: false },
    { texto: 'Monterrey', correcta: false },
    { texto: 'Tijuana', correcta: false }
  ]

  const validar = async (opcion: typeof opciones[0]) => {
    const ok = opcion.correcta
    setRespuesta(ok ? '✅ ¡Correcto!' : '❌ Incorrecto')
    setCompletada(true)

    try {
      await fetch('/api/complete-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: actionId })
      })
    } catch (err) {
      console.error('❌ Error al completar acción:', err)
    }

    // Avanzamos tras un ratito
    setTimeout(onComplete, 500)
  }

  return (
    <div className="max-w-xl mx-auto mt-4 bg-white rounded-xl shadow-xl p-6 text-center">
      <h1 className="text-xl font-bold mb-4">🧠 Trivia Local</h1>
      <p className="text-sm text-gray-600 mb-6">¿Cuál es la capital de México?</p>

      <div className="grid gap-3 mb-4">
        {opciones.map((op, idx) => (
          <button
            key={idx}
            disabled={completada}
            className="w-full bg-clicalo-azul text-white px-4 py-2 rounded hover:opacity-80 disabled:opacity-50"
            onClick={() => validar(op)}
          >
            {op.texto}
          </button>
        ))}
      </div>

      {respuesta && (
        <p
          className={`text-lg font-semibold mb-4 inline-block px-4 py-2 rounded 
            ${respuesta.startsWith('✅')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'}`}
        >
          {respuesta}
        </p>
      )}
    </div>
  )
}
