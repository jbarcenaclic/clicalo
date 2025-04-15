// src/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Bienvenido a CLÍCALO MVP</h1>
      <Link href="/frontend/pages/TiradaDemo">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Probar Tirada
        </button>
      </Link>
    </main>
  )
}
