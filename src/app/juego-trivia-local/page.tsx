// src/app/juego-trivia-local/page.tsx
'use client'


import { useState, useEffect } from 'react'


export default function JuegoTriviaLocal() {
  const [respuesta, setRespuesta] = useState<string | null>(null)
  const [completada, setCompletada] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  const opciones = [
    { texto: 'Ciudad de México', correcta: true },
    { texto: 'Guadalajara', correcta: false },
    { texto: 'Monterrey', correcta: false },
    { texto: 'Tijuana', correcta: false }
  ]

  useEffect(() => {
    if (window.top === window.self) {
      // No estamos dentro de un iframe
      window.location.href = '/tirada'
    }
  }, [])
 
  useEffect(() => {
    let ultimaAltura = 0
    const enviarAltura = () => {
      const altura = document.body.scrollHeight
      if (Math.abs(altura - ultimaAltura) > 20) {
        window.parent.postMessage({ tipo: 'ajustarAltura', altura }, '*')
        ultimaAltura = altura
      }
    }
  
    const observer = new ResizeObserver(enviarAltura)
    observer.observe(document.body)
  
    enviarAltura()
  
    return () => {
      observer.disconnect()
    }
  }, [])
  
  
  
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const actionId = queryParams.get('action_id')
    if (actionId) setActionId(actionId)
  }, [])

  const validar = async (opcion: typeof opciones[0]) => {
    setRespuesta(opcion.correcta ? '✅ ¡Correcto!' : '❌ Incorrecto')
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
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-xl p-6 text-center">
      <h1 className="text-xl font-bold mb-4">🧠 Trivia Local</h1>
      <p className="text-sm text-gray-600 mb-6">
        ¿Cuál es la capital de México?
      </p>

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

      {respuesta && <p className="text-lg font-medium mb-4">{respuesta}</p>}

      {completada && (
        <button
          onClick={() => {
            window.parent.postMessage({ tipo: 'accionCompletada' }, '*')
          }}
          className="inline-block mt-4 px-6 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-600"
        >
          ✅ Completar acción
        </button>
      )}

    </div>
  )
}
