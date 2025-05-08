// src/app/tirada/page.tsx
'use client'
import { useEffect, useState } from 'react'
import PageContainer from '@/components/PageContainer'
import PrimaryButton from '@/components/PrimaryButton'
import { DashboardRuta } from '@/components/DashboardRuta'
import PushSubscription from '@/components/PushSubscription'
import AccionBitlabs from '@/components/AccionBitlabs'
import { firmarUserId } from '@/utils/firmarUserId.client'
import { Dialog } from '@headlessui/react'
import { useSearchParams } from 'next/navigation'


type Action = {
  id: string
  orden: number
  tipo: string
  url_inicio: string
  network?: string
  payout_estimado?: number
}

export default function TiradaPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [tiradaId, setTiradaId] = useState<string | null>(null)
  const [currentAction, setCurrentAction] = useState<Action | null>(null)
  const [message, setMessage] = useState('')
  const [tiradaDone, setTiradaDone] = useState(false)
  const [rewardValue, setRewardValue] = useState(0.035)
  const [transitioning, setTransitioning] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [showBienvenida, setShowBienvenida] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams?.get('bienvenida') === '1') {
      setShowBienvenida(true)
    }
  }, [searchParams])
  
  const [progreso, setProgreso] = useState({
    tiradasCompletadas: 0,
    accionesEnCurso: 0,
  })

  const obtenerProgreso = async (userId: string): Promise<any> => {
    try {
      const firma = firmarUserId(userId)
      if (!firma) {
        console.error('[tirada] error al firmar user_id')
        return
      }
      console.log('[tirada] obteniendo progreso para user_id:', userId)
      console.log('[tirada] firma:', firma)
      console.log('[tirada] url:', `/api/user-progress?user_id=${userId}&sig=${firma}`)
      const res = await fetch(`/api/user-progress?user_id=${userId}&sig=${firma}`)
      const json = await res.json()
      setProgreso(json)
      console.log('[tirada] progreso actualizado:', json)
      return json
    } catch (e) {
      console.error('[tirada] error al obtener progreso', e)
    }
  } 

  useEffect(() => {
    let mounted = true

    const iniciar = async () => {

      const res = await fetch('/api/get-user-id', { credentials: 'include' })
      const json = await res.json()
      if (!res.ok) {
        window.location.href = '/'
        return
      }
      const uid = json.user_id

      if (!uid) {
        window.location.href = '/'
        return
      }
      console.log('[tirada] intentando iniciar con user_id:', uid)

      if (mounted) {
        setUserId(uid)
        await iniciarTirada(uid)
        await obtenerProgreso(uid)
      }
    }

    iniciar()
    return () => {
      mounted = false
    }
  }, [])

  const iniciarTirada = async (uid: string) => {
    try {
      const res = await fetch('/api/start-tirada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid }),
      })

      const data = await res.json()
      console.log('[tirada] respuesta de start-tirada:', data)

      if (!res.ok) {
        console.error('[tirada] error al iniciar tirada:', data?.error)
        return
      }

      setTiradaId(data.tirada_id)
      setTiradaDone(false)
      setCurrentAction(null)
      await cargarSiguienteAccion(data.tirada_id, uid)
    } catch (e) {
      console.error('[tirada] error en iniciarTirada:', e)
    }
  }

  const cargarSiguienteAccion = async (tid: string, uid: string) => {
    try {
      console.log('[tirada] solicitando siguiente acción para:', tid)
      const firma = firmarUserId(uid)
      console.log('[tirada] firma:', firma)
      const res = await fetch(`/api/next-action?tirada_id=${tid}&user_id=${uid}&sig=${firma}`)
      const json = await res.json()
      console.log('[tirada] respuesta JSON completa:', json)

      const { action } = json

      if (!action) {
        console.log('[tirada] no hay más acciones en esta tirada')
        setTiradaDone(true)
        setCurrentAction(null)
        setMessage('')

        const nuevoProgreso = await obtenerProgreso(uid)
        if (!retrying && nuevoProgreso?.tiradasCompletadas < 10) {
          setRetrying(true)
          setTimeout(() => {
            iniciarTirada(uid)
            setRetrying(false)
          }, 1000)
        }
        return
      }

      console.log('[tirada] ✅ Acción encontrada:', action)
      setCurrentAction(action)
      setMessage(`✅ Acción ${action.orden} de 3 completada`)
    } catch (e) {
      console.error('[tirada] error en cargarSiguienteAccion:', e)
    }
  }

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
      await cargarSiguienteAccion(tiradaId, userId)
      await obtenerProgreso(userId)
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
            <button
              onClick={() => setShowBienvenida(false)}
              className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
            >
              ¡Vamos!
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <PushSubscription />
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-center text-white mb-2">🎯 Tu progreso diario</h1>
          <DashboardRuta
            tiradasCompletadas={progreso.tiradasCompletadas}
            accionesEnCurso={progreso.accionesEnCurso}
          />
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
            <div className="p-4 bg-white rounded shadow mb-4">
              <p className="text-xl font-bold text-clicalo-azul">🔹 Acción {currentAction.orden}</p>
              <p className="text-gray-600 text-sm">(tipo: {currentAction.tipo})</p>
            </div>
            <PrimaryButton onClick={completarAccion}>
              ✅ Completar acción
            </PrimaryButton>
          </>
        )}

        {!tiradasRestantes && (
          <div className="mt-8 p-6 bg-white shadow-xl rounded-lg border border-green-300 text-center text-clicalo-azul">
            <h2 className="text-3xl font-bold text-green-700 mb-2">🎉 ¡Meta diaria alcanzada!</h2>
            <p className="text-xl mb-4">Ganaste <strong>${(rewardValue * 10).toFixed(3)}</strong></p>
            <div className="mb-4">
              {currentAction?.url_inicio && (
                <iframe
                  src={currentAction.url_inicio}
                  width="100%"
                  height="600"
                  allow="fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                  className="w-full h-[600px] rounded border shadow"
                />
              )}
            </div>
            <p className="text-sm text-white/80 mb-2">Haz clic en “✅ Completar acción” solo cuando hayas terminado la encuesta.</p>
            <AccionBitlabs
              action={currentAction}
              onComplete={async () => {
                setTransitioning(true)
                if (tiradaId && userId) {
                  await cargarSiguienteAccion(tiradaId, userId)
                  await obtenerProgreso(userId)
                }
                setTransitioning(false)
              }}
            />
          </div>
        )}

        {message && tiradasRestantes && !tiradaDone && (
          <p className="mt-6 text-white bg-green-600 inline-block px-4 py-2 rounded shadow font-semibold">
            {message}
          </p>
        )}
      </div>
    </PageContainer>
  )
}
