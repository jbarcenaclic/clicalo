'use client'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import PrimaryButton from '@/components/PrimaryButton'

type Action = {
  id: string
  orden: number
  tipo: string
}

export default function TiradaPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [tiradaId, setTiradaId] = useState<string | null>(null)
  const [currentAction, setCurrentAction] = useState<Action | null>(null)
  const [message, setMessage] = useState('')
  const [tiradaDone, setTiradaDone] = useState(false)
  const [rewardVisible, setRewardVisible] = useState(false)
  const [rewardValue, setRewardValue] = useState(0.035)
  const [transitioning, setTransitioning] = useState(false)
  const [phone, setPhone] = useState<string | null>(null)


  useEffect(() => {
    let mounted = true
  
    const iniciar = async () => {
      const uid = localStorage.getItem('user_id')
      if (!uid) {
        window.location.href = '/'
        return
      }
  
      console.log('[tirada] intentando iniciar con user_id:', uid)
  
      if (mounted) {
        setUserId(uid)
        iniciarTirada(uid)
      }
    }
  
    iniciar()
  
    return () => {
      mounted = false
    }
  }, [])

  const iniciarTirada = async (uid: string) => {
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
    cargarSiguienteAccion(data.tirada_id)
  }

  const cargarSiguienteAccion = async (tid: string) => {
    console.log('[tirada] solicitando siguiente acción para:', tid)
    const res = await fetch(`/api/next-action?tirada_id=${tid}`)
    const json = await res.json()
    console.log('[tirada] respuesta JSON completa:', json)
  
    const { action } = json
  
    if (!action) {
      setCurrentAction(null)
      setTiradaDone(true)
      setRewardVisible(true)
    } else {
      console.log('[tirada] ✅ Acción encontrada:', action)
      setCurrentAction(action)
      setMessage(`✅ Acción ${action.orden} de 3 completada`)
    }
  }

  const completarAccion = async () => {
    if (!currentAction) return
    setTransitioning(true)
  
    await fetch('/api/complete-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action_id: currentAction.id,
        duration: 5,
      }),
    })
  
    // Mostrar transición 1.5s
    setTimeout(() => {
      setTransitioning(false)
      cargarSiguienteAccion(tiradaId!)
    }, 1500)
  }
  

  return (
    <Layout>
      <div className="max-w-md mx-auto text-center p-6">
        <h1 className="text-2xl font-bold mb-4">🎮 Tirada del día</h1>

        {!tiradaDone && currentAction && !transitioning && (
          <div className="mb-6">
            <p className="text-lg font-medium text-clicalo-azul mb-2">
              Acción {currentAction.orden} de 3
            </p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-300 w-20 ${
                    step <= currentAction.orden ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {transitioning && (
          <div className="flex flex-col items-center gap-4 mt-8 text-white animate-pulse">
            <p className="text-xl font-bold text-green-300">✅ ¡Acción completada!</p>
            <p className="text-sm text-white/70">Preparando la siguiente acción...</p>
            <div className="text-4xl animate-bounce">🎯</div>
          </div>
        )}



        {!tiradaDone && currentAction && (
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

        {tiradaDone && rewardVisible && (
          <div className="mt-8 p-6 bg-white shadow-xl rounded-lg border border-green-300 text-center text-clicalo-azul">
            <h2 className="text-3xl font-bold text-green-700 mb-2">🎉 ¡Tirada completada!</h2>
            <p className="text-xl mb-4">Ganaste <strong>${rewardValue.toFixed(3)}</strong></p>
            <PrimaryButton onClick={() => window.location.href = '/tirada'}>
              Volver al dashboard
            </PrimaryButton>
          </div>
        )}

        {message && !tiradaDone && <p className="mt-6 text-white bg-green-600 inline-block px-4 py-2 rounded shadow font-semibold">{message}</p>}
      </div>
    </Layout>
  )
}
