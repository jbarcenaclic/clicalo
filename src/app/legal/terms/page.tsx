// src/app/legal/terms/page.tsx
'use client'

import { texts } from '@/i18n/texts'
import { useLogin } from '@/context/LoginContext'
import termsEs from '@/content/legal/terms.es.txt'
import termsEn from '@/content/legal/terms.en.txt'

export default function TermsPage() {
  const { preferred_language } = useLogin()
  const fullText = preferred_language === 'en' ? termsEn : termsEs
  const t = texts[preferred_language || 'es']  // fallback a 'es'
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white whitespace-pre-line">
      <h1 className="text-2xl font-bold mb-6">{t.termsTitle}</h1>
      <p className="mb-4 text-sm text-yellow-400">{t.termsLastUpdate}</p>
      <p>{fullText}</p>
    </div>
  )
}