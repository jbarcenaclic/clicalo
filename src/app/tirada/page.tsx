'use client'
import { useState } from 'react'
import Layout from '@/components/Layout'
import PrimaryButton from '@/components/PrimaryButton'

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
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-center">🎮 CLÍCALO Tirada Demo</h1>

      {!tiradaId && (
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Tu ID de Supabase"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 rounded w-64 text-black"
          />
          <PrimaryButton onClick={iniciarTirada}>Start Tirada</PrimaryButton>
        </div>
      )}

      {tiradaId && !currentAction && !tiradaDone && (
        <p className="text-sm text-clicalo-grisTexto animate-pulse">🔄 Buscando acción...</p>
      )}

      {tiradaId && currentAction && (
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 border bg-white shadow rounded text-clicalo-azul w-full max-w-md">
            <p className="text-xl font-semibold">🔹 Action #{currentAction.orden}</p>
            <p className="text-sm text-clicalo-grisTexto">(type: {currentAction.tipo})</p>
          </div>
          <PrimaryButton onClick={completarAccion}>Complete Action</PrimaryButton>
        </div>
      )}

      {tiradaDone && rewardVisible && (
        <div className="mt-8 p-6 bg-white shadow-xl rounded-lg border border-green-300 animate-pulse text-center text-clicalo-azul max-w-md">
          <h2 className="text-3xl font-bold text-green-700 mb-2">🎉 Reward Unlocked!</h2>
          <p className="text-xl mb-4">You earned <strong>${rewardValue.toFixed(3)}</strong> for this tirada.</p>
          <p className="text-sm text-gray-600">Daily and monthly totals will be shown here soon.</p>
          <PrimaryButton onClick={() => {
            setTiradaId('')
            setCurrentAction(null)
            setMessage('')
            setRewardVisible(false)
          }}>
            Start New Tirada
          </PrimaryButton>
        </div>
      )}

      {message && <p className="mt-6 text-lg text-clicalo-grisTexto">{message}</p>}
    </Layout>
  )
}
