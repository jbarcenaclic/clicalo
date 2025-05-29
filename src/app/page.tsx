// src/app/page.tsx
'use client'
import { useState, useEffect } from 'react'
import PageContainer from '@/components/PageContainer'
import PrimaryButton from '@/components/PrimaryButton'
import { useLogin } from '@/context/LoginContext'
import { texts } from '@/i18n/texts'
import { useLanguageCountry } from '@/hooks/useLanguageCountry'
import { getGeolocation } from '@/utils/getGeolocation'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'

export default function Home() {
  
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const { language, setLanguage, country, setCountry } = useLanguageCountry()
  const [error, setError] = useState('')
  const router = useRouter()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    // Limpiar el número de teléfono
    const cleanedPhone = phone.replace(/\D/g, '');
  
    // Validar que se haya ingresado un número
    if (!cleanedPhone) {
      setError('Por favor, ingresa tu número de teléfono.');
      setLoading(false);
      return;
    }
  
    // Validar longitud mínima
    if (cleanedPhone.length < 10) {
      setError('Número de teléfono demasiado corto. Debe tener al menos 10 dígitos.');
      setLoading(false);
      return;
    }
  
    // Validar formato E.164
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      setError('Número de teléfono inválido. Usa el formato E.164 (ej: +5212345678901).');
      setLoading(false);
      return;
    }
  
    try {
      // Verificar si el usuario ya existe
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', cleanedPhone)
        .single();
  
      if (supabaseError && supabaseError.code !== 'PGRST116') {
        setError('Error al verificar el usuario.');
        setLoading(false);
        return;
      }
  
      if (data) {
        // Usuario existente, redirigir a /tasks
        router.push('/tasks' as Route);
      } else {
        // Usuario nuevo, redirigir a la página de registro
        router.push(`/register?phone=${encodeURIComponent(cleanedPhone)}` as Route);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.' + (err instanceof Error ? `: ${err.message}` : ''));
    } finally {
      setLoading(false);
    }
  };
  
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
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4">
            <input
              type="tel"
              placeholder={texts[language].placeholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              disabled={loading}
              className="p-2 rounded border w-64 text-black disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <PrimaryButton onClick={handleSubmit} disabled={loading}>
              {loading ? texts[language].loading : texts[language].boton}
            </PrimaryButton>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
