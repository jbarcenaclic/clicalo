export default function TiradaCompletada() {
    return (
      <div className="bg-green-700/90 text-white p-4 rounded-lg shadow-md border border-green-300 text-center mt-8 animate-pulse">
        <p className="text-lg font-bold">✅ Acción completada</p>
        <p className="text-sm">Preparando la siguiente acción...</p>
        <div className="text-3xl mt-2 animate-bounce">🎯</div>
      </div>
    )
  }