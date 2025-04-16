'use client'
import { useState } from 'react'

export default function TiradaDemo() {
  const [userId, setUserId] = useState('')
  const [tiradaId, setTiradaId] = useState('')
  const [currentAction, setCurrentAction] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [tiradaDone, setTiradaDone] = useState(false)
  const [rewardVisible, setRewardVisible] = useState(false)
  const [rewardValue, setRewardValue] = useState(0.035)

  const iniciarTirada = async () => {
    const res = await fetch('/api/start-tirada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
    const data = await res.json()
    console.log('[Frontend] Acción recibida:', data)
    setTiradaId(data.tirada_id)
    setMessage('🎯 Tirada started')
    setRewardVisible(false)
    setTiradaDone(false)
    cargarSiguienteAccion(data.tirada_id)
  }

  const cargarSiguienteAccion = async (tirada_id: string) => {
    const res = await fetch(`/api/next-action?tirada_id=${tirada_id}`)
    if (res.status === 404) {
      setCurrentAction(null)
      setMessage('🎉 Tirada complete!')
      setTiradaDone(true)
      setRewardVisible(true)
      return
    }
    const data = await res.json()

    if (!data || data.length === 0 || !data[0]?.id) {
      setCurrentAction(null)
      setMessage('⚠️ Acción no válida')
      return
    }
    
    setCurrentAction(data[0]) 
    setMessage(`Action ${data[0].orden} of 3`)
  }

  const completarAccion = async () => {
    if (!currentAction) return
    await fetch('/api/complete-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_id: currentAction.id, duration: 5 }),
    })
    cargarSiguienteAccion(tiradaId)
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-100 to-blue-100 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-6">🎮 CLÍCALO Tirada Demo</h1>

      {!tiradaId && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Your Supabase User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <button
            onClick={iniciarTirada}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Start Tirada
          </button>
        </div>
      )}
      
      {tiradaId && !currentAction && !tiradaDone && (
        <p className="text-sm text-gray-500 animate-pulse">🔄 Buscando acción...</p>
      )}

      {tiradaId && currentAction && (
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 border bg-white shadow rounded">
            <p className="text-xl">🔹 Action #{currentAction.orden}</p>
            <p className="text-sm text-gray-500">(type: {currentAction.tipo})</p>
          </div>
          <button
            onClick={completarAccion}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Complete Action
          </button>
        </div>
      )}

      {tiradaDone && rewardVisible && (
        <div className="mt-8 p-6 bg-white shadow-xl rounded-lg border border-green-300 animate-pulse">
          <h2 className="text-3xl font-bold text-green-700 mb-2">🎉 Reward Unlocked!</h2>
          <p className="text-xl mb-4">You earned <strong>${rewardValue.toFixed(3)}</strong> for this tirada.</p>
          <p className="text-sm text-gray-600">Daily and monthly totals will be shown here soon.</p>
          <button
            onClick={() => {
              setTiradaId('')
              setCurrentAction(null)
              setMessage('')
              setRewardVisible(false)
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Start New Tirada
          </button>
        </div>
      )}

      {message && <p className="mt-6 text-lg text-indigo-700">{message}</p>}
    </div>
  )
}
