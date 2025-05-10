'use client'
import { useEffect, useState } from 'react'
import PrimaryButton from './PrimaryButton'

type Props = {
    action: {
      id: string
      orden: number
      tipo: string
      url_inicio: string
    } | null
    onComplete: () => void
  }
  
export default function AccionBitlabs({ action, onComplete }: Props) {
  const [startTime, setStartTime] = useState<number | null>(null)
 
  useEffect(() => {
    if (action) {
      setStartTime(Date.now())
    }
  }, [action])

  if (!action) return null // ya es seguro dejarlo aquí

  const completarAccion = async () => {
    const duracionMs = startTime ? Date.now() - startTime : 0
    const segundos = Math.round(duracionMs / 1000)

    await fetch('/api/complete-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action_id: action.id,
        duration: segundos,
        valorVisible: 0.035 // valor fijo por tirada (puedes hacerlo prop si prefieres)
      })
    })

    onComplete()
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-6">
      <iframe
        src={action.url_inicio}
        width="100%"
        height="600"
        allow="fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms"
        className="w-full h-[600px] rounded border shadow"
      />

      <p className="text-white text-sm opacity-80">
        Haz clic en “✅ Completar acción” solo cuando hayas terminado la encuesta.
      </p>

      <PrimaryButton onClick={completarAccion}>
        ✅ Completar acción
      </PrimaryButton>
    </div>
  )
}
