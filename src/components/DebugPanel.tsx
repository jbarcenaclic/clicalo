// src/components/DebugPanel.tsx
'use client'

type Action = {
  id: string
  orden: number
  tipo: string
  network?: string
  payout_estimado?: number
  url_inicio: string
}

function DebugPanelImpl({ action }: { action: Action | null }) {
  if (!action) return null

  return (
    <div className="mt-6 text-left text-xs bg-black/70 text-white p-4 rounded shadow">
      <p className="font-bold text-sm mb-1">🛠 Debug Acción Actual</p>
      <p><strong>ID:</strong> {action.id}</p>
      <p><strong>Orden:</strong> {action.orden}</p>
      <p><strong>Tipo:</strong> {action.tipo}</p>
      <p><strong>Network:</strong> {action.network}</p>
      <p><strong>Payout estimado:</strong> {action.payout_estimado}</p>
      <p><strong>URL inicio:</strong> {action.url_inicio}</p>
    </div>
  )
}

function EmptyDebugPanel() {
  return null
}

// ✅ Decide cuál exportar
const env = process.env.NEXT_PUBLIC_VERCEL_ENV
const DebugPanel = env === 'preview' ? DebugPanelImpl : EmptyDebugPanel

export default DebugPanel
