'use client'

import { useEffect, useState } from 'react'
import { getCookie, setCookie } from '@/utils/cookies'
import { useLogin } from '@/context/LoginContext'
import { getGeolocation } from '@/utils/getGeolocation'

type Language = 'es' | 'en'

export function useLanguageCountry() {
  const [language, setLanguageState] = useState<Language>('es')
  const [country, setCountry] = useState<string | null>(null)
  const { userId, preferred_language } = useLogin()

  const setLanguage = async (new_lang: Language) => {
    setLanguageState(new_lang)
    setCookie('language', new_lang)

    if (userId) {
      try {
        await fetch('/api/update-language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, language: new_lang }),
          credentials: 'include',
        })
      } catch (err) {
        console.error('Error actualizando language en Supabase:', err)
      }
    }
  
    // ✅ Fuerza recarga para aplicar cambio de language
    window.location.reload()
  }

  useEffect(() => {
    const cookieLanguage = getCookie('language')
  
    if (cookieLanguage === 'es' || cookieLanguage === 'en') {
      setLanguageState(cookieLanguage)
    } else if (preferred_language === 'es' || preferred_language === 'en') {
      setLanguageState(preferred_language)
      setCookie('idioma', preferred_language)
    }
  }, [preferred_language])

  useEffect(() => {
    const detectarPais = async () => {
      const geo = await getGeolocation()
      if (!geo) return
  
      if (geo.security?.vpn || geo.security.proxy || geo.security.tor) {
        window.location.href = '/blocked'
        alert('⚠️ No puedes usar CLÍCALO con una VPN activa.')
        return
      }
  
      setCountry(geo.country_code)
    }
    detectarPais()
  }, [])

  return {
    language,
    setLanguage,
    country,
    setCountry,
  }
}
