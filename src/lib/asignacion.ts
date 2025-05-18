// src/lib/asignacion.ts

import { obtenerAccionDeBitLabs } from './bitlabs'
import { obtenerAccionDeTheoremReach } from './theoremreach'
import { obtenerTriviaLocal } from './trivias'
import { AccionAsignada } from '@/types/Action'

export async function obtenerAccionDeRed(user_id: string) : Promise<AccionAsignada | null> {
  const redes = [obtenerAccionDeBitLabs, obtenerAccionDeTheoremReach]

  for (const red of redes) {
    const accion = await red(user_id)
    if (accion) {
      console.log(`[asignacion] Acción asignada desde red: ${red.name}`)
      return accion
    }
  }

  console.warn('[asignacion] No se pudo asignar acción desde ninguna red. Usando trivia local.')
  return obtenerTriviaLocal(user_id)
}
