// src/app/page.tsx
'use client'
import { useEffect, useState } from 'react'
import PageContainer from '@/components/PageContainer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/PrimaryButton'
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user_id = localStorage.getItem('user_id')
    if (user_id) {
      setLoggedIn(true)
    }
  }, [])

  const handleLogin = async () => {
    if (!phone) return alert('Ingresa tu número')
    setLoading(true)
    try {
      const res = await fetch('/api/login-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user_id', data.user_id)
        localStorage.setItem('phone', phone)
        router.push('/tirada')
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      alert('❌ Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <p className="text-xl mb-6 text-center font-light tracking-wide">
        Microeconomía digital participativa para LATAM
      </p>

      <section className="bg-white text-clicalo-azul rounded-xl p-6 max-w-xl w-full shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">¿Cómo funciona?</h2>
        <ul className="space-y-2 text-lg list-disc list-inside">
          <li>10 tiradas al día</li>
          <li>3 acciones por tirada</li>
          <li>Gana dinero real desde WhatsApp o web</li>
          <li>Pagos mensuales, sin instalar apps</li>
        </ul>
      </section>

      {!loggedIn && (
        <div className="text-center mb-10">
          <p className="mb-2 text-lg text-clicalo-grisTexto">Ingresa tu número para comenzar</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4">
            <input
              type="tel"
              placeholder="Tu número (ej. +525512345678)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-2 rounded border w-64 text-black"
            />
            <PrimaryButton onClick={handleLogin} disabled={loading}>
              {loading ? 'Cargando...' : 'Ingresar'}
            </PrimaryButton>
          </div>
        </div>
      )}

      {loggedIn && (
        <section className="text-center">
          <p className="mb-2 text-lg text-clicalo-grisTexto">+1,000 usuarios registrados</p>
          <p className="mb-6 text-lg text-clicalo-grisTexto">85% tasa de finalización · $0.045 USD por acción</p>
          <Link href="/tirada">
            <PrimaryButton>Ir a mi tirada</PrimaryButton>
          </Link>
        </section>
      )}
    </PageContainer>
  )
}
