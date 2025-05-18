// src/lib/theoremreach.ts
export async function obtenerAccionDeTheoremReach(user_id: string) {
  const useMock = process.env.THEOREMREACH_USE_MOCK === 'true'
  const SURVEY_ID = process.env.THEOREMREACH_SURVEY_ID

  if (useMock || !SURVEY_ID) {
    console.warn('[TheoremReach] Usando MOCK en modo desarrollo.')

    return {
      campaign_id: `theoremreach_mock_${user_id}`,
      url: `https://example.com/theoremreach-mock?user_id=${user_id}`,
      payout: 0.25,
      title: 'Encuesta simulada (TheoremReach)',
      estimated_duration: 180,
      network: 'theoremreach',
      tipo: 'survey'
    }
  }

  const url = `https://theoremreach.com/surveys/${SURVEY_ID}?user_id=${user_id}`

  return {
    campaign_id: `theoremreach_${user_id}`,
    url,
    payout: 0.25,
    title: 'Encuesta disponible',
    estimated_duration: 180,
    network: 'theoremreach',
    tipo: 'survey'
  }
}
