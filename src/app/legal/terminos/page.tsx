// src/app/legal/terminos/page.tsx
'use client'

import { texts } from '@/i18n/texts'
import { useLogin } from '@/context/LoginContext'

export default function TerminosPage() {
  const { preferred_language } = useLogin()
  const t = texts.legal.terms[preferred_language || 'es']  // fallback a 'es'
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      <p className="mb-4 text-sm text-yellow-400">{t.lastUpdate}</p>

      <h2 className="font-bold text-lg mt-6 mb-2">1. {t.acceptance}</h2>
      <p className="mb-4">{t.acceptanceText}</p>

      <h2 className="font-bold text-lg mt-6 mb-2">2. {t.nature}</h2>
      <p className="mb-4">{t.natureText}</p>

      <h2 className="font-bold text-lg mt-6 mb-2">3. {t.limits}</h2>
      <p className="mb-4">{t.limitsText}</p>
    </div>
  )
}