'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState, memo } from 'react'

function DashboardRutaComponent({
  tiradasCompletadas = 0,
  accionesEnCurso = 0,
}: {
  tiradasCompletadas: number
  accionesEnCurso: number
}) {
  const tiradaRef = useRef<(HTMLDivElement | null)[]>([])
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const activa = tiradaRef.current[tiradasCompletadas]
    if (activa) {
      activa.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }

    setFlash(true)
    const timeout = setTimeout(() => setFlash(false), 500)
    return () => clearTimeout(timeout)
  }, [tiradasCompletadas])

  const bloques = Array.from({ length: 10 }, (_, i) => {
    const esCompletado = i < tiradasCompletadas
    const esActivo = i === tiradasCompletadas

    return (
      <motion.div
        key={i}
        ref={(el) => {
          tiradaRef.current[i] = el
        }}
        className="flex flex-col items-center gap-1 min-w-[48px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
      >
        <div
          className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-bold shadow-md
            ${esCompletado ? 'bg-green-500' : esActivo ? 'bg-yellow-400' : 'bg-gray-300'}
          `}
        >
          {i + 1}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, j) => {
            let pasoClase = 'bg-gray-300'
            let animacion = ''

            if (esCompletado) {
              pasoClase = 'bg-green-500'
            } else if (esActivo) {
              if (j < accionesEnCurso - 1) {
                pasoClase = 'bg-green-500'
              } else if (j === accionesEnCurso - 1) {
                pasoClase = 'bg-yellow-400'
                animacion = 'animate-ping'
              }
            }

            return (
              <div key={j} className="relative w-2 h-2 flex items-center justify-center">
                {animacion && (
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full ${pasoClase} ${animacion}`}
                    style={{ boxShadow: '0 0 0 2px rgba(255,255,0,0.4)' }}
                  />
                )}
                <span className={`relative block h-full w-full rounded-full ${pasoClase}`} />
              </div>
            )
          })}
        </div>
      </motion.div>
    )
  })

  return (
    <div className={`overflow-x-auto w-full px-2 transition-all duration-300 ${flash ? 'bg-yellow-100' : ''}`}>
      <div className="flex justify-start items-center gap-4 min-w-[720px] px-4 py-2">
        <span className="text-yellow-400 text-2xl">🌞</span>
        {bloques}
        <span className="text-green-500 text-2xl">🏁</span>
      </div>
    </div>
  )
}

export const DashboardRuta = memo(DashboardRutaComponent)
