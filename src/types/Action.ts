export type Action = {
    id: string
    tirada_id: string
    tipo: string
    orden: number
    completada: boolean
    start_time?: string | null
    end_time?: string | null
    created_at?: string
    network?: string
    external_id?: string
    url_inicio: string
    payout_estimado?: number
    payout_real?: number
    fecha_completada?: string | null
  }
  
  export type AccionAsignada = {
    tipo: string
    network: string
    campaign_id: string
    url: string
    payout: number
    title: string
    estimated_duration: number
  }
  