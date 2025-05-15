'use client'
import { useEffect, useState, useCallback, useRef } from 'react'

import PageContainer from '@/components/PageContainer'
import PrimaryButton from '@/components/PrimaryButton'
import { DashboardRuta } from '@/components/DashboardRutaCarrusel'
import PushSubscription from '@/components/PushSubscription'
import { firmarUserId } from '@/utils/firmarUserId.client'
import { Dialog } from '@headlessui/react'
import JuegoTriviaLocalEmbedded from '@/components/JuegoTriviaLocalEmbedded'
import DebugPanel from '@/components/DebugPanel'


type Action = {
  id: string
  orden: number
  tipo: string
  url_inicio: string
  network?: string
  payout_estimado?: number
}

type Progreso = {
  tiradasCompletadas: number
  accionesEnCurso: number
  rachaDias?: number
  totalSemanal?: number
}

export default function TiradaContent() {
  const [userId, setUserId] = useState<string | null>(null)
  const [tiradaId, setTiradaId] = useState<string | null>(null)
  const [currentAction, setCurrentAction] = useState<Action | null>(null)
  const [message, setMessage] = useState('')
  const [tiradaDone, setTiradaDone] = useState(false)
  const [rewardValue, setRewardValue] = useState(0.035)
  const [transitioning, setTransitioning] = useState(false)
  const [showBienvenida, setShowBienvenida] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)


  useEffect(() => {
    if (currentAction) {
      console.log('[UI] Acción actual:', currentAction)
      console.log('[UI] URL inicio:', currentAction.url_inicio)
      console.log('[UI] Tipo de acción:', currentAction.tipo)
    }
  }, [currentAction])
  

  const [progreso, setProgreso] = useState<Progreso>({
    tiradasCompletadas: 0,
    accionesEnCurso: 0,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const yaVisto = sessionStorage.getItem('vistoBienvenida')
      if (!yaVisto) {
        setShowBienvenida(true)
        sessionStorage.setItem('vistoBienvenida', '1')
      }
    }
  }, [])

  const obtenerProgreso = useCallback(async (userId: string): Promise<Progreso | undefined> => {
    try {
      const firma = firmarUserId(userId)
      const res = await fetch(`/api/user-progress?user_id=${userId}&sig=${firma}`)
      const json = await res.json()
      setProgreso(json)
      return json
    } catch (e) {
      console.error('[tirada] error al obtener progreso', e)
    }
  }, [])

  const cargarSiguienteAccion = useCallback(async (tid: string,) => {
    try {
      const res = await fetch('/api/next-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tirada_id: tid }),
      })
      const json = await res.json()
      const { action } = json

      setCurrentAction(action)
      if (!action) {
        console.warn('[tirada] Acción inválida o vacía:', action)
        return
      }
      setRewardValue(action.payout_estimado || 0.035)
      setMessage(`✅ Acción ${action.orden} de 3 completada`)
    } catch (e) {
      console.error('[tirada] error en cargarSiguienteAccion:', e)
    }
  }, [])

  const iniciarTirada = useCallback(async (uid: string) => {
    if (progreso.tiradasCompletadas >= 10) {
      console.log('[tirada] Ya completaste las 10 tiradas. No se iniciará otra.')
      return
    }
    try {
      const res = await fetch('/api/start-tirada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          console.log('[tirada] límite de tiradas alcanzado')
          return // o mostrar un mensaje personalizado
        }
        console.error('[tirada] error al iniciar tirada:', data?.error)
        return
      }

      setTiradaId(data.tirada_id)
      setTiradaDone(false)
      setCurrentAction(null)
      await cargarSiguienteAccion(data.tirada_id)
    } catch (e) {
      console.error('[tirada] error en iniciarTirada:', e)
    }
  }, [progreso.tiradasCompletadas, cargarSiguienteAccion])

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.tipo === 'accionCompletada') {
        console.log('[tirada] Acción local completada vía postMessage')
  
        if (currentAction?.id) {
          try {
            await fetch('/api/complete-action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action_id: currentAction.id,
                valorVisible: rewardValue,
                duration: 5,
              }),
            })
            console.log('[tirada] Acción marcada como completada desde postMessage')
          } catch (err) {
            console.error('[tirada] Error al completar acción local vía postMessage', err)
          }
        }
  
        if (tiradaId && userId) {
          await cargarSiguienteAccion(tiradaId)
          await obtenerProgreso(userId)
        }
      }
      if (event.data?.tipo === 'ajustarAltura' && iframeRef.current) {
        iframeRef.current.style.height = `${event.data.altura}px`
      }

    }
  
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [tiradaId, userId, currentAction, rewardValue, cargarSiguienteAccion, obtenerProgreso])
  
 
  useEffect(() => {
    let mounted = true
    const iniciar = async () => {
      const res = await fetch('/api/get-user-id', { credentials: 'include' })
      const json = await res.json()
      if (!res.ok || !json.user_id) {
        window.location.href = '/'
        return
      }
      if (mounted) {
        setUserId(json.user_id)
        await iniciarTirada(json.user_id)
        await obtenerProgreso(json.user_id)
      }
    }
    iniciar()
    return () => {
      mounted = false
    }
  }, [iniciarTirada, obtenerProgreso])

  const completarAccion = async () => {
    if (!currentAction) return
    setTransitioning(true)
    try {
      await fetch('/api/complete-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valorVisible: rewardValue,
          action_id: currentAction.id,
          duration: 5,
        }),
      })
    } catch (err) {
      console.error('[tirada] Error en complete-action:', err)
    }
    setTransitioning(false)
    if (tiradaId && userId) {
      await cargarSiguienteAccion(tiradaId)
      await obtenerProgreso(userId)
    }
  }

  function generarMensajeCompartir() {
    const base = '¡Ya completé mis 10 tiradas de hoy en CLÍCALO! 💰'
  
    if (progreso?.rachaDias && progreso.rachaDias >= 3) {
      return `🔥 Llevo ${progreso.rachaDias} días seguidos ganando en CLÍCALO. ¡Súmate tú también!`
    }
  
    if (progreso?.totalSemanal && progreso.totalSemanal >= 0.5) {
      return `💸 Esta semana gané $${progreso.totalSemanal.toFixed(2)} en CLÍCALO solo por hacer clics.`
    }
  
    return base
  }

  const compartirProgreso = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CLÍCALO',
        text: generarMensajeCompartir(),
        url: window.location.href,
      }).catch((err) => {
        console.error('Error al compartir:', err)
        alert('No se pudo compartir. Intenta copiar el link manualmente.')
      })
    } else {
      alert('Tu dispositivo no soporta compartir directamente. Puedes copiar el enlace manualmente 😉')
    }
  }
  const tiradasRestantes = progreso.tiradasCompletadas < 10

  return (
    <PageContainer>
      <Dialog open={showBienvenida} onClose={() => setShowBienvenida(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
            <Dialog.Title className="text-2xl font-bold text-clicalo-azul mb-2">🎉 ¡Bienvenido!</Dialog.Title>
            <p className="text-gray-700 mb-4">
              Hoy puedes ganar hasta <strong>$0.045 USD por acción</strong>.<br />
              ¡Haz tus 10 tiradas y acumula racha!
            </p>
            <button onClick={() => setShowBienvenida(false)} className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold">
              ¡Vamos!
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <PushSubscription />

      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-center text-white mb-2">🎯 Tu progreso diario</h1>
          <DashboardRuta tiradasCompletadas={progreso.tiradasCompletadas} accionesEnCurso={progreso.accionesEnCurso} />
        </div>

        {tiradasRestantes && transitioning && (
          <div className="flex flex-col items-center gap-4 mt-8 text-white animate-pulse">
            <p className="text-xl font-bold text-green-300">✅ ¡Acción completada!</p>
            <p className="text-sm text-white/70">Preparando la siguiente acción...</p>
            <div className="text-4xl animate-bounce">🎯</div>
          </div>
        )}
       
       {tiradasRestantes && !tiradaDone && currentAction && (
          <>

            {currentAction.network === 'Local' ? (
              <>
                <JuegoTriviaLocalEmbedded
                  key={currentAction.id}
                  actionId={currentAction.id}
                  onComplete={async () => {
                    if (tiradaId && userId) {
                      await cargarSiguienteAccion(tiradaId)
                      await obtenerProgreso(userId)
                    }
                  }}
                />
              </>
            ) : (
              <>
                <iframe
                  src={currentAction.url_inicio}
                  width="100%"
                  height="600"
                  allow="fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                  className="w-full h-[600px] rounded border shadow"
                />
                <p className="text-sm text-white/80 mt-4">
                  Haz clic en “✅ Completar acción” solo cuando hayas terminado la encuesta.
                </p>
                <PrimaryButton onClick={completarAccion}>✅ Completar acción</PrimaryButton>
              </>
            )}

          </>
        )}

        {!tiradasRestantes && (
          <div className="mt-8 p-6 bg-white shadow-xl rounded-lg border border-green-300 text-center text-clicalo-azul">
            <h1 className="text-4xl font-bold mb-4">🎉🎉🎉</h1>
            <h2 className="text-3xl font-bold text-green-700 mb-2">¡Meta diaria alcanzada!</h2>
            <p className="text-xl mb-1">
              Ganaste <strong>${(rewardValue * 10).toFixed(3)}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">Vuelve mañana para seguir sumando.</p>

            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={compartirProgreso}
                className="bg-white text-green-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                📤 Compartir
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition"
              >
                ⬅️ Volver al inicio
              </button>
            </div>
          </div>
        )}

      </div>
      <DebugPanel action={currentAction} />

    </PageContainer>
  )
}
