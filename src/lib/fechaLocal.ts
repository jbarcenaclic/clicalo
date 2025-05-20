import { toZonedTime, format } from 'date-fns-tz'

type FechaLocalResult = {
  fecha: string // formato: yyyy-MM-dd
  hora: string  // formato: HH:mm:ss
}

export function getFechaLocal(userData?: { timezone?: string }): FechaLocalResult {
  const timezone = userData?.timezone || 'America/Mexico_City'
  const ahora = new Date()
  const zonedDate = toZonedTime(ahora, timezone)

  const fecha = format(zonedDate, 'yyyy-MM-dd')
  const hora = format(zonedDate, 'HH:mm:ss')

  return { fecha, hora }
}
