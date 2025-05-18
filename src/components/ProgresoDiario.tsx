// src/components/ProgresoDiario.tsx
type Props = {
    tiradasCompletadas: number
    totalAcciones: number
    montoGanado: number // en MXN
    metaDiaria: number  // en MXN
  }
  
  export default function ProgresoDiario({ tiradasCompletadas, totalAcciones, montoGanado, metaDiaria }: Props) {
    // const progreso = Math.min((tiradasCompletadas / totalAcciones) * 100, 100)
    const puntos = Array.from({ length: totalAcciones }).map((_, i) => (
      <div
        key={i}
        className={`w-4 h-4 rounded-full border-2 mx-1 ${i < tiradasCompletadas ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}
      />
    ))
  
    return (
      <div className="bg-white p-4 rounded-xl shadow border text-center mb-4">
        <p className="font-semibold text-gray-700 mb-2">Hoy puedes ganar hasta: <span className="font-bold text-black">${metaDiaria.toFixed(0)} MXN</span></p>
        <div className="flex justify-center items-center mb-2">{puntos}</div>
        <p className="text-green-600 font-bold text-lg">+${montoGanado.toFixed(0)}</p>
        <p className="text-sm text-gray-600 mt-2">Avance de tu día: {tiradasCompletadas} de {totalAcciones} acciones completadas</p>
      </div>
    )
  }
  