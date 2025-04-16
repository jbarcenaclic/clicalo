'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0052A4] text-white flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <Image 
        src="/logo-clicalo.png" 
        alt="CLÍCALO logo" 
        width={200} 
        height={200} 
        className="mb-6"
        priority
      />

      {/* Tagline */}
      <h1 className="text-4xl font-bold text-center mb-2">
        CLÍCALO
      </h1>
      <p className="text-xl mb-6 text-center font-light tracking-wide">
        Microeconomía digital participativa para LATAM
      </p>

      {/* Sección de beneficios */}
      <section className="bg-white text-[#0052A4] rounded-xl p-6 max-w-xl w-full shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">¿Cómo funciona?</h2>
        <ul className="space-y-2 text-lg list-disc list-inside">
          <li>10 tiradas al día</li>
          <li>3 acciones por tirada (encuestas, anuncios, CPA)</li>
          <li>Gana dinero real desde WhatsApp o web</li>
          <li>Pagos mensuales, sin instalar apps</li>
        </ul>
      </section>

      {/* Estadísticas y CTA */}
      <section className="text-center">
        <p className="mb-2 text-lg text-[#E5E5E5]">+1,000 usuarios registrados</p>
        <p className="mb-6 text-lg text-[#E5E5E5]">85% tasa de finalización · $0.045 USD por acción</p>

        <Link
          href="https://wa.me/5215555555555?text=Hola!%20Quiero%20más%20información%20sobre%20CLÍCALO"
          target="_blank"
        >
          <button className="bg-[#FFD633] hover:bg-[#F8B100] text-[#0052A4] font-semibold py-3 px-6 rounded-full text-lg transition">
            Solicita acceso privado
          </button>
        </Link>
      </section>
    </main>
  )
}
