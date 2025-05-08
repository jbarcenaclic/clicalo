// src/app/tirada/page.tsx
'use client'

import { Suspense } from 'react'
import TiradaContent from './TiradaContent'

export default function TiradaPage() {
  return (
    <Suspense fallback={<div>Cargando tirada...</div>}>
      <TiradaContent />
    </Suspense>
  )
}
