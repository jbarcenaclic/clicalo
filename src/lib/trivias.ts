// src/lib/trivias.ts

export async function obtenerTriviaLocal(user_id: string) {
  return {
    tipo: 'juego',
    network: 'Local',  // ✅ REQUERIDO
    campaign_id: `trivia_${user_id}`,
    url: '/juego-trivia-local',
    payout: 0.1,
    title: 'Trivia interna',
    estimated_duration: 90
  }
}
