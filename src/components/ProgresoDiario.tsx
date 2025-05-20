// src/components/ProgresoDiario.tsx
'use client'
import { formatCurrency, textos } from '@/i18n/texts'
import { usePaisIdioma } from '@/hooks/usePaisIdioma'




type Props = {
  tiradasCompletadas: number
  totalAcciones: number
  montoGanado: number
  metaDiaria: number 
}

export default function ProgresoDiario({
  tiradasCompletadas,
  totalAcciones,
  montoGanado,
  metaDiaria,
}: Props) {
  const { idioma, pais } = usePaisIdioma()


  const puntos = Array.from({ length: totalAcciones }).map((_, i) => (
    <div
      key={i}
      className={`w-4 h-4 rounded-full border-2 mx-1 ${i < tiradasCompletadas ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}
    />
  ))

  return (
    <div className="bg-white p-4 rounded-xl shadow border text-center mb-4">
      <p className="font-semibold text-gray-700 mb-2">
        {textos[idioma].progresoHoy}{' '}
        <span className="font-bold text-black">
          {formatCurrency(metaDiaria, pais, idioma)}
        </span>
      </p>
      <div className="flex justify-center items-center mb-2">{puntos}</div>
      <p className="text-green-600 font-bold text-lg">
        {formatCurrency(montoGanado, pais, idioma)}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        {textos[idioma].progresoAvance(tiradasCompletadas, totalAcciones)}
      </p>
    </div>
  )
}

  