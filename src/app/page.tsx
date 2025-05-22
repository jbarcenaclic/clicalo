// src/app/page.tsx
'use client'
import { useState, useEffect } from 'react'
import PageContainer from '@/components/PageContainer'
import Link from 'next/link'
import PrimaryButton from '@/components/PrimaryButton'
import { useLogin } from '@/context/LoginContext'
import { texts } from '@/i18n/texts'
import { useLanguageCountry } from '@/hooks/useLanguageCountry'
import { getGeolocation } from '@/utils/getGeolocation'



export default function Home() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const { language, setLanguage, country, setCountry } = useLanguageCountry()
  const rewardBase = 0.045

  useEffect(() => {
    const detectCountry = async () => {
      const geo = await getGeolocation()
      if (!geo) return
  
      if (geo.security.vpn || geo.security.proxy || geo.security.tor) {
        alert('⚠️ No puedes usar CLÍCALO con una VPN o proxy activado.')
        // Opcional: redirigir o bloquear
        window.location.href = '/blocked'
        return
      }
  
      setCountry(geo.country_code)
    }
    detectCountry()
  }, [setCountry])

  const { isLoggedIn } = useLogin()

  const handleLogin = async () => {
    if (!phone) return alert('Pon tu número y listo!')
    setLoading(true)
    try {
      const res = await fetch('/api/login-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
        credentials: 'include', // 🧠 importante para recibir la cookie
      })
      if (res.ok) {
        window.location.href = '/tirada?bienvenida=1'
      } else {
        const data = await res.json()
        alert(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      alert('❌ Error inesperado')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => setLanguage('es')} aria-label="Cambiar a Español">
          🇲🇽
        </button>
        <button onClick={() => setLanguage('en')} aria-label="Switch to English">
          🇺🇸
        </button>
      </div>


      <p className="text-xl mb-6 text-center font-light tracking-wide">
        {texts[language].titulo}
      </p>
      {country && (
        <p className="text-center text-sm text-clicalo-grisTexto mt-2">
          {language === 'es' ? 'País detectado' : 'Detected country'}: {country === 'MX' ? '🇲🇽 México' : country === 'US' ? '🇺🇸 USA' : country}
        </p>
      )}

      <section className="bg-white text-clicalo-azul rounded-xl p-6 max-w-xl w-full shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-0 text-center">{texts[language].mainDescription(rewardBase, country ?? 'MX', language)}</h2>
      </section>

      {!isLoggedIn && (
        <div className="text-center mb-10">
          <p className="mb-2 text-lg text-clicalo-grisTexto">{texts[language].mensaje}</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4">
            <input
              type="tel"
              placeholder={texts[language].placeholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleLogin()
                }
              }}
              disabled={loading}
              className="p-2 rounded border w-64 text-black disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <PrimaryButton onClick={handleLogin} disabled={loading}>
              {loading ? texts[language].loading : texts[language].boton}
            </PrimaryButton>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <section className="text-center">
          <p className="mb-2 text-lg text-clicalo-grisTexto">{texts[language].registered}</p>
          <p className="mb-6 text-lg text-clicalo-grisTexto">{texts[language].stats(rewardBase, country ?? 'MX', language)}</p>
          <Link href="/tirada">
            <PrimaryButton>{texts[language].goToTask}</PrimaryButton>
          </Link>
        </section>
      )}
    </PageContainer>
  )
}
