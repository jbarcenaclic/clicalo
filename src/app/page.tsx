// src/app/page.tsx
'use client'
import { useState } from 'react'
import PageContainer from '@/components/PageContainer'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/PrimaryButton'
import { useLogin } from '@/context/LoginContext'


export default function Home() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  //const router = useRouter()

  const { isLoggedIn } = useLogin()

  const handleLogin = async () => {
    if (!phone) return alert('Ingresa tu número')
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
      <p className="text-xl mb-6 text-center font-light tracking-wide">
      Convierte tu tiempo digital en recompensas reales.
      </p>

      <section className="bg-white text-clicalo-azul rounded-xl p-6 max-w-xl w-full shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">¿Cómo funciona?</h2>
        <ul className="space-y-2 text-lg list-disc list-inside">
          <li>Realiza acciones como ver anuncios o responder encuestas</li>
          <li>Recibe tus recompensas en efectivo cada mes, fácil y seguro</li>
          <li>No descargas nada. Funciona directo desde tu navegador</li>
          <li>No necesitas cuenta de banco ni dar tus datos personales</li>
        </ul>
      </section>

      {!isLoggedIn && (
        <div className="text-center mb-10">
          <p className="mb-2 text-lg text-clicalo-grisTexto">Ingresa tu número para comenzar</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4">
          <input
              type="tel"
              placeholder="Tu número (ej. +525512345678)"
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
              {loading ? 'Cargando...' : 'Ingresar'}
            </PrimaryButton>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <section className="text-center">
          <p className="mb-2 text-lg text-clicalo-grisTexto">+1,000 usuarios registrados</p>
          <p className="mb-6 text-lg text-clicalo-grisTexto">85% tasa de finalización · $0.045 USD por acción</p>
          <Link href="/tirada?bienvenida=1">
            <PrimaryButton>Ir a mi tirada</PrimaryButton>
          </Link>
        </section>
      )}
    </PageContainer>
  )
}
