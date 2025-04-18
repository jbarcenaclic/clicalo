'use client'
import { motion } from 'framer-motion'

export default function DashboardRuta({
  tiradasCompletadas = 4,
  accionesEnCurso = 1,
}: {
  tiradasCompletadas: number
  accionesEnCurso: number
}) {
  const bloques = Array.from({ length: 10 }, (_, i) => {
    const esCompletado = i < tiradasCompletadas
    const esActivo = i === tiradasCompletadas

    return (
      <motion.div
        key={i}
        className="flex flex-col items-center gap-1"
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
            const pasoCompleto = esCompletado || (esActivo && j < accionesEnCurso)
            return (
              <div
                key={j}
                className={`w-2 h-2 rounded-full transition-colors duration-300
                  ${pasoCompleto ? 'bg-green-500' : 'bg-gray-300'}`}
              />
            )
          })}
        </div>
      </motion.div>
    )
  })

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <span className="text-yellow-400 text-2xl">🌞</span>
      {bloques}
      <span className="text-green-500 text-2xl">🏁</span>
    </div>
  )
}
