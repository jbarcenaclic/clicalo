export type GeoInfo = {
    ip: string
    country_code: string
    country_name: string
    timezone: string
    security: {
      vpn: boolean
      proxy: boolean
      tor: boolean
      hosting: boolean
    }
  }
  
  export async function getGeolocation(): Promise<GeoInfo | null> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return {
          ip: '127.0.0.1',
          country_code: 'MX',
          country_name: 'México',
          timezone: 'America/Mexico_City',
          security: {
            vpn: false,
            proxy: false,
            tor: false,
            hosting: false,
          },
        }
      }
  
      const res = await fetch('https://ipapi.co/json/')
      if (!res.ok) throw new Error('Error al consultar ipapi')
      const data = await res.json()
  
      return {
        ip: data.ip,
        country_code: data.country_code,
        country_name: data.country_name,
        timezone: data.timezone,
        security: {
          vpn: data.security?.vpn || false,
          proxy: data.security?.proxy || false,
          tor: data.security?.tor || false,
          hosting: data.security?.hosting || false,
        },
      }
    } catch (error) {
      console.error('Error al obtener geolocalización:', error)
      return null
    }
  }
