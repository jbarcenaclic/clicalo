// src/app/verify/page.tsx
import { Suspense } from 'react'
import VerifyClient from './VerifyClient'

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Cargando verificación…</div>}>
      <VerifyClient />
    </Suspense>
  )
}
