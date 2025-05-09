// src/components/DashboardRutaCarrusel.tsx
'use client'

import { motion } from 'framer-motion'
import { memo, useEffect, useRef } from 'react'

export function DashboardRutaCarrusel({
  tiradasCompletadas = 0,
  accionesEnCurso = 0,
  totalTiradas = 10,
}: {
  tiradasCompletadas: number
  accionesEnCurso: number
  totalTiradas?: number
}) {
  const tiradaRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const activa = tiradaRef.current[1] // el bloque central siempre es la tirada activa
    if (activa) {
      activa.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [tiradasCompletadas])

  const indices = [
    tiradasCompletadas - 1,
    tiradasCompletadas,
    tiradasCompletadas + 1,
  ].filter(i => i >= 0 && i < totalTiradas)

  const bloques = indices.map((i, idx) => {
    const esCompletado = i < tiradasCompletadas
    const esActivo = i === tiradasCompletadas

    return (
        <motion.div
            key={i}
            ref={(el) => {
                tiradaRef.current[idx] = el
            }}
            className="flex flex-col items-center gap-1 min-w-[48px]"
            initial={{
                opacity: 0,
                x: idx === 0 ? -30 : idx === 2 ? 30 : 0, // izquierda/derecha/centro
            }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
        >
       <div
          className={`rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300
            ${esCompletado ? 'bg-green-500' : esActivo ? 'bg-yellow-400' : 'bg-gray-300'}
            ${esActivo ? 'w-12 h-12 text-xl' : 'w-8 h-8 text-sm opacity-70'}
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
  const mostrarSol = tiradasCompletadas < 2
  const mostrarBandera = tiradasCompletadas > totalTiradas - 3
  
  const flujoFinalizado = tiradasCompletadas >= totalTiradas
  if (flujoFinalizado) {
    return (
      <div className="flex flex-col items-center justify-center mt-6 text-center">
        <motion.div
          initial={{ scale: 0.6, rotate: -10 }}
          animate={{ scale: [0.6, 1.2, 1], rotate: [0, 15, -10, 0] }}
          transition={{ duration: 1 }}
          className="text-6xl"
        >
          🏁
        </motion.div>
      </div>
    )
  }
  

  return (
    <div className="flex justify-center items-center gap-6 px-4 py-2">
    {mostrarSol && <span className="text-yellow-400 text-2xl">🌞</span>}
    {bloques}
    {mostrarBandera && (
        <motion.span
            className="text-green-500 text-2xl"
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: [0.8, 1.2, 1], rotate: [-10, 10, -5, 0] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
            🏁
        </motion.span>
    )}

    </div>
  )
}

export const DashboardRuta = memo(DashboardRutaCarrusel)
