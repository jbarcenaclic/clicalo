// src/i18n/texts.ts

export const texts = {
  es: {
    titulo: 'Convierte tu tiempo digital en recompensas reales.',
    mainDescription: (value: number, country: string, language: string) =>
      `Con solo 20 minutos en tu celular, obtén hasta · ${formatCurrency(value, country, language)} diarios ($1,200 al mes)`,
    placeholder: 'Tu número (ej. +52(55)1234-5678)',
    boton: 'Comienza ahora!',
    mensaje: 'Pon tu número y listo!',
    loading: 'Cargando...',
    registered: '+1,000 usuarios registrados',
    stats: (value: number, country: string, language: string) =>
      `85% tasa de finalización · ${formatCurrency(value, country, language)} por acción`,
    
    goToTask : 'Ir a mi tarea diaria',
    bienvenidaTitulo: '🎉 ¡Bienvenido!',
    bienvenidaTexto: (value: number, country: string, language: string) =>
      `Hoy puedes ganar hasta <strong>${formatCurrency(value, country, language)} por acción</strong>.<br />¡Haz tus 10 tiradas y acumula racha!`,      bienvenidaBoton: '¡Vamos!',
    mensajeAccionCompletada: (orden: number) => `✅ Acción ${orden} de 3 completada`,
    compartirBase: '¡Ya completé mis 10 tiradas de hoy en CLÍCALO! 💰',
    compartirRacha: (dias: number) => `🔥 Llevo ${dias} días seguidos ganando en CLÍCALO. ¡Súmate tú también!`,
    compartirGanancia: (cantidad: number) => `💸 Esta semana gané $${cantidad.toFixed(2)} en CLÍCALO solo por hacer clics.`,
    compartirError: 'No se pudo compartir. Intenta copiar el link manualmente.',
    compartirNoSoportado: 'Tu dispositivo no soporta compartir directamente. Puedes copiar el enlace manualmente 😉',
    progresoHoy: 'Hoy puedes ganar hasta:',
    progresoAvance: (hechas: number, total: number) => `Avance de tu día: ${hechas} de ${total} acciones completadas`,
    cobroHasAcumulado: 'Has acumulado',
    cobroPodrasCobrar: (umbral: number, restante: number) => `Podrás cobrar al llegar a $${umbral} • Te faltan $${restante}`,
    cobroSaldoProceso: 'Saldo en proceso',
    cobroSaldoValidando: 'Tus acciones recientes están en validación',
    cobroBotonHabilitado: '¡Cobrar Ahora!',
    cobroBotonDeshabilitado: (restante: number) => `Aún no puedes cobrar. Te faltan $${restante}`,
  },
  en: {
    titulo: 'Turn your screen time into real rewards.',
    mainDescription: (value: number, country: string, language: string) =>
      `Only 20 on your phone can get you up to · ${formatCurrency(value, country, language)} daily ($150 monthly)`,
    placeholder: 'Your number (e.g. +1(123)456-7890',
    boton: 'Get started!',
    mensaje: 'Enter your number to begin!',
    loading: 'Loading...',
    registered: '+1,000 registered users',
    stats: (value: number, country: string, language: string) =>
      `85% completion rate · ${formatCurrency(value, country, language)} per action`,
    
    goToTask: 'Go to my task',
    bienvenidaTitulo: '🎉 Welcome!',
    bienvenidaTexto: (value: number, country: string, language: string) =>`Today you can earn up to <strong>${formatCurrency(value, country, language)} per action</strong>.<br />Complete your 10 turns and keep your streak!`,
    bienvenidaBoton: 'Let’s go!',
    mensajeAccionCompletada: (orden: number) => `✅ Action ${orden} of 3 completed`,
    compartirBase: 'I just finished my 10 daily turns on CLÍCALO! 💰',
    compartirRacha: (dias: number) => `🔥 I’ve been winning for ${dias} days in a row on CLÍCALO. Join me!`,
    compartirGanancia: (cantidad: number) => `💸 I earned $${cantidad.toFixed(2)} this week just clicking around on CLÍCALO.`,
    compartirError: 'Sharing failed. Try copying the link manually.',
    compartirNoSoportado: 'Your device does not support sharing. Copy the link manually 😉',
    progresoHoy: 'Today you can earn up to:',
    progresoAvance: (hechas: number, total: number) => `Your daily progress: ${hechas} of ${total} actions completed`,
    cobroHasAcumulado: 'You have accumulated',
    cobroPodrasCobrar: (umbral: number, restante: number) => `You can withdraw at $${umbral} • $${restante} to go`,
    cobroSaldoProceso: 'Pending balance',
    cobroSaldoValidando: 'Your recent actions are being validated',
    cobroBotonHabilitado: 'Withdraw Now!',
    cobroBotonDeshabilitado: (restante: number) => `You can’t withdraw yet. You need $${restante} more`,
  },
}

export function getCurrencyLabel(country: string | null): string {
  switch (country) {
    case 'MX': return 'MXN'
    case 'US': return 'USD'
    case 'CO': return 'COP'
    case 'BR': return 'BRL'
    default: return 'USD'
  }
}

export function getCurrencySymbol(country: string | null): string {
  switch (country) {
    case 'MX': return '$'
    case 'US': return '$'
    case 'CO': return '$'
    case 'BR': return 'R$'
    case 'CL': return '$'
    case 'AR': return '$'
    case 'PE': return 'S/'
    case 'PH': return '₱'
    default: return '$'
  }
}

export function formatCurrency(
  value: number,
  country: string | null = 'US',
  language: string | null = 'en'
): string {
  const currencyMap: Record<string, string> = {
    MX: 'MXN',
    US: 'USD',
    CO: 'COP',
    BR: 'BRL',
    CL: 'CLP',
    AR: 'ARS',
    PE: 'PEN',
    PH: 'PHP',
  }

  const currency = currencyMap[country ?? 'US'] || 'USD'

  // language local → ajusta decimales, coma/punto, etc.
  const locale = language === 'es' ? 'es-MX' : 'en-US'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol', // 🔄 puedes usar 'code' si prefieres USD/MXN
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
