// src/lib/bitlabs.ts
export async function obtenerAccionDeBitLabs(user_id: string) {
  console.warn('[bitlabs] MOCK activado. Cuenta aún no verificada.')
  console.log('[bitlabs] Asignando acción de BitLabs para el usuario:', user_id)

  return {
    campaign_id: 'bitlabs_mock_1',
    url: 'https://bitlabs.ai/mock-url',
    payout: 0.25,
    title: 'Oferta Demo BitLabs',
    estimated_duration: 120,
    network: 'bitlabs',
    tipo: 'survey'
  }
}
