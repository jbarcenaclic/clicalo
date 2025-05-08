import axios from 'axios'

const BITLABS_API_KEY = process.env.BITLABS_API_KEY
const BITLABS_USER_ID_NAMESPACE = 'clicalo' // para evitar colisiones

export async function obtenerAccionDeBitLabs(user_id: string) {
  try {
    const bitlabs_uid = `${BITLABS_USER_ID_NAMESPACE}_${user_id}`
    const url = `https://api.bitlabs.ai/v1/offers?uid=${bitlabs_uid}`
    console.log(`[bitlabs] buscando ofertas para UID: ${bitlabs_uid}`)


    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${BITLABS_API_KEY}`
      }
    })

    const offers = response.data?.data?.offers
    if (!offers || offers.length === 0) return null

    const topOffer = offers[0] // puedes aplicar filtros si deseas

    return {
      campaign_id: topOffer.id,
      url: topOffer.link,
      payout: parseFloat(topOffer.payout) || 0,
      title: topOffer.name,
      estimated_duration: topOffer.estimated_completion_time || null
    }
  } catch (error) {
    console.error('Error al obtener acción de BitLabs:', error)
    return null
  }
}
