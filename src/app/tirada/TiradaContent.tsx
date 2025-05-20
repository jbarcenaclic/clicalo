'use client'
import { useEffect, useState, useCallback, useRef } from 'react'

import PageContainer from '@/components/PageContainer'
import ProgresoDiario from '@/components/ProgresoDiario'

import PushSubscription from '@/components/PushSubscription'
import { firmarUserId } from '@/utils/firmarUserId.client'
import { Dialog } from '@headlessui/react'
import JuegoTriviaLocalEmbedded from '@/components/JuegoTriviaLocalEmbedded'
import DebugPanel from '@/components/DebugPanel'
import AccionFrame from '@/components/AccionFrame'
//import InstruccionCompletar from '@/components/InstruccionCompletar'
import TiradaCompletada from '@/components/TiradaCompletada'
import { MetaAlcanzada } from '@/components/MetaAlcanzada'
import { ResumenCobro } from '@/components/ResumenCobro'
import { textos } from '@/i18n/texts'
import { usePaisIdioma } from '@/hooks/usePaisIdioma'



import { Action } from '@/types/Action'

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
  const { idioma, pais } = usePaisIdioma()


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
      setMessage(textos[idioma].mensajeAccionCompletada(action.orden))
    } catch (e) {
      console.error('[tirada] error en cargarSiguienteAccion:', e)
    }
  }, [idioma])

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

  

  function generarMensajeCompartir() {
    if (progreso?.rachaDias && progreso.rachaDias >= 3) {
      return textos[idioma].compartirRacha(progreso.rachaDias)
    }
  
    if (progreso?.totalSemanal && progreso.totalSemanal >= 0.5) {
      return textos[idioma].compartirGanancia(progreso.totalSemanal)
    }
  
    return textos[idioma].compartirBase
  }
  

  const compartirProgreso = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CLÍCALO',
        text: generarMensajeCompartir(),
        url: window.location.href,
      }).catch((err) => {
        console.error('Error al compartir:', err)
        alert(textos[idioma].compartirError)         // al fallar navigator.share
      })
    } else {
      alert(textos[idioma].compartirNoSoportado)   // si no soportado
    }
  }
  const tiradasRestantes = progreso.tiradasCompletadas < 10

  return (
    <PageContainer>
      <Dialog open={showBienvenida} onClose={() => setShowBienvenida(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
            <Dialog.Title className="text-2xl font-bold text-clicalo-azul mb-2">
              {textos[idioma].bienvenidaTitulo}
            </Dialog.Title>
            <p
              className="text-gray-700 mb-4"
              dangerouslySetInnerHTML={{
                __html: textos[idioma].bienvenidaTexto(rewardValue, pais ?? 'US', idioma),
              }}
            />
            <button onClick={() => setShowBienvenida(false)} className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold">
              {textos[idioma].bienvenidaBoton}
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <PushSubscription />

      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
        <ProgresoDiario
          key={idioma}
          tiradasCompletadas={progreso.tiradasCompletadas}
          totalAcciones={10}
          montoGanado={progreso.tiradasCompletadas * rewardValue * 17} 
          metaDiaria={10 * rewardValue * 17}
        />
        </div>

        {tiradasRestantes && transitioning && <TiradaCompletada />}
       
        {tiradasRestantes && !tiradaDone && currentAction && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-clicalo-azul mb-6">
                {message && (
                  <div className="text-sm text-green-600 text-center mb-4">
                    {message}
                  </div>
                )}
                <AccionFrame>
                  {currentAction.network === 'Local' ? (
                    <>
                      <JuegoTriviaLocalEmbedded
                        key={currentAction.id}
                        actionId={currentAction.id}
                        onComplete={async () => {
                          if (tiradaId && userId) {
                            setTransitioning(true)
                            setTimeout(() => setTransitioning(false), 1000)
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
                          


                    </>
                  )}
                </AccionFrame>
              </div>
            </>
          )}

          {!tiradasRestantes && (
            <MetaAlcanzada
              rewardTotal={rewardValue * 10}
              onShare={compartirProgreso}
              onReturn={() => (window.location.href = '/')}
            />
          )}

      </div>
      <ResumenCobro
        acumulado={150}
        saldoProceso={85}
        umbral={300}
      />

      <DebugPanel action={currentAction} />

    </PageContainer>
  )
}
