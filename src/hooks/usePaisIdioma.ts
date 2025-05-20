'use client'

import { useEffect, useState } from 'react'
import { getCookie, setCookie } from '@/utils/cookies'
import { useLogin } from '@/context/LoginContext'
import { getGeolocation } from '@/utils/getGeolocation'

type Idioma = 'es' | 'en'

export function usePaisIdioma() {
  const [idioma, setIdiomaState] = useState<Idioma>('es')
  const [pais, setPais] = useState<string | null>(null)
  const { userId, idioma_preferido } = useLogin()

  const setIdioma = async (nuevo: Idioma) => {
    setIdiomaState(nuevo)
    setCookie('idioma', nuevo)

    if (userId) {
      try {
        await fetch('/api/update-idioma', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, idioma: nuevo }),
          credentials: 'include',
        })
      } catch (err) {
        console.error('Error actualizando idioma en Supabase:', err)
      }
    }
  
    // ✅ Fuerza recarga para aplicar cambio de idioma
    window.location.reload()
  }

  useEffect(() => {
    const cookieIdioma = getCookie('idioma')
  
    if (cookieIdioma === 'es' || cookieIdioma === 'en') {
      setIdiomaState(cookieIdioma)
    } else if (idioma_preferido === 'es' || idioma_preferido === 'en') {
      setIdiomaState(idioma_preferido)
      setCookie('idioma', idioma_preferido)
    }
  }, [idioma_preferido])

  useEffect(() => {
    const detectarPais = async () => {
      const geo = await getGeolocation()
      if (!geo) return
  
      if (geo.security?.vpn || geo.security.proxy || geo.security.tor) {
        window.location.href = '/bloqueado'
        alert('⚠️ No puedes usar CLÍCALO con una VPN activa.')
        return
      }
  
      setPais(geo.country_code)
    }
    detectarPais()
  }, [])

  return {
    idioma,
    setIdioma,
    pais,
    setPais,
  }
}
