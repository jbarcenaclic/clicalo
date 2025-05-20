'use client'
import { usePaisIdioma } from '@/hooks/usePaisIdioma'
import { textos } from '@/i18n/texts'

type PropsResumen = {
  acumulado: number
  saldoProceso: number
  umbral: number
}

export function ResumenCobro({ acumulado, saldoProceso, umbral }: PropsResumen) {
  const { idioma } = usePaisIdioma()
  const restante = Math.max(umbral - acumulado, 0)
  const puedeCobrar = acumulado >= umbral

  return (
    <div className="bg-white p-4 rounded-xl shadow border text-center mt-6">
      <div className="mb-2">
        <p className="text-lg font-semibold text-clicalo-azul">{textos[idioma].cobroHasAcumulado}</p>
        <p className="text-2xl font-bold text-green-600">${acumulado.toFixed(0)} MXN</p>
        <p className="text-sm text-gray-600">{textos[idioma].cobroPodrasCobrar(umbral, restante)}</p>
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-700">{textos[idioma].cobroSaldoProceso}</p>
        <p className="text-base text-gray-900">${saldoProceso.toFixed(0)} MXN</p>
        <p className="text-xs text-gray-500">{textos[idioma].cobroSaldoValidando}</p>
      </div>
      <button
        disabled={!puedeCobrar}
        className={`w-full mt-4 py-2 rounded font-bold text-white transition ${
          puedeCobrar ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {puedeCobrar
          ? textos[idioma].cobroBotonHabilitado
          : textos[idioma].cobroBotonDeshabilitado(restante)}
      </button>
    </div>
  )
}
