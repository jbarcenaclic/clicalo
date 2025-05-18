export function MetaAlcanzada({ rewardTotal, onShare, onReturn }: { rewardTotal: number; onShare: () => void; onReturn: () => void }) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-br from-green-100 to-white shadow-xl rounded-xl border-2 border-green-400 text-center">
        <h1 className="text-5xl font-black text-green-700 mb-2">🎉</h1>
        <h2 className="text-2xl font-bold text-clicalo-azul mb-2">¡Meta diaria alcanzada!</h2>
        <p className="text-xl mb-4">Ganaste <strong>${rewardTotal.toFixed(3)}</strong></p>
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={onShare}
            className="bg-white text-green-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition shadow"
          >📤 Compartir</button>
          <button
            onClick={onReturn}
            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition shadow"
          >⬅️ Volver al inicio</button>
        </div>
      </div>
    )
  }