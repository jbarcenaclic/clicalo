'use client'

import { useState, useMemo } from 'react'

type Opcion = { texto: string; correcta: boolean }
type Trivia = { pregunta: string; opciones: Opcion[] }

type Props = {
  actionId: string
  onComplete: () => void
}

export default function JuegoTriviaLocalEmbedded({ actionId, onComplete }: Props) {
  const [respuesta, setRespuesta] = useState<string | null>(null)
  const [completada, setCompletada] = useState(false)

  const trivia = useMemo(() => {
    const trivias: Trivia[] = [
      {
        pregunta: '¿Cuál es la capital de México?',
        opciones: [
          { texto: 'Ciudad de México', correcta: true },
          { texto: 'Guadalajara', correcta: false },
          { texto: 'Monterrey', correcta: false },
          { texto: 'Tijuana', correcta: false }
        ]
      },
      {
        pregunta: '¿En qué estado se encuentra Cancún?',
        opciones: [
          { texto: 'Yucatán', correcta: false },
          { texto: 'Quintana Roo', correcta: true },
          { texto: 'Campeche', correcta: false },
          { texto: 'Veracruz', correcta: false }
        ]
      },
      {
        pregunta: '¿Qué volcán es el más alto de México?',
        opciones: [
          { texto: 'Iztaccíhuatl', correcta: false },
          { texto: 'Paricutín', correcta: false },
          { texto: 'Pico de Orizaba', correcta: true },
          { texto: 'Popocatépetl', correcta: false }
        ]
      }
    ]
    const hash = [...actionId].reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const index = hash % trivias.length
    console.log('[Embedded] actionId:', actionId, '→ Trivia:', trivias[index].pregunta)
    return trivias[index]
  }, [actionId])

  const validar = async (opcion: Opcion) => {
    setRespuesta(opcion.correcta ? '✅ ¡Correcto!' : '❌ Incorrecto')
    setCompletada(true)
    try {
      await fetch('/api/complete-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: actionId })
      })
  
      // Esperar 2 segundos antes de continuar
      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (err) {
      console.error('❌ Error al completar acción:', err)
    }
  }
  

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-xl p-6 text-center">
      <h1 className="text-xl font-bold mb-4">🧠 Trivia Local</h1>
      <p className="text-sm text-gray-600 mb-6">{trivia.pregunta}</p>

      <div className="grid gap-3 mb-4">
        {trivia.opciones.map((op, idx) => (
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
        <p className="text-lg font-semibold mb-4 text-clicalo-azul bg-yellow-100 px-4 py-2 rounded shadow">
          {respuesta}
        </p>
      )}

    </div>
  )
}
