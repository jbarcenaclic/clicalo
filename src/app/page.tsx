'use client'
import Layout from '@/components/Layout'
import Link from 'next/link'
import PrimaryButton from '@/components/PrimaryButton'
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <Layout>
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

      <section className="text-center">
        <p className="mb-2 text-lg text-clicalo-grisTexto">+1,000 usuarios registrados</p>
        <p className="mb-6 text-lg text-clicalo-grisTexto">85% tasa de finalización · $0.045 USD por acción</p>
        <Link href="/tirada">
          <PrimaryButton>Iniciar ahora</PrimaryButton>
        </Link>

      </section>
    </Layout>
  )
}