// src/app/legal/privacy/page.tsx
'use client'

import { texts } from '@/i18n/texts'
import { useLogin } from '@/context/LoginContext'
import privacyEs from '@/content/legal/privacy.es.txt'
import privacyEn from '@/content/legal/privacy.en.txt'


export default function ProvacyPage() {
  const { preferred_language } = useLogin()
  const t = texts[preferred_language || 'es']  // fallback to 'es'
  const fullText = preferred_language === 'en' ? privacyEn : privacyEs
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white whitespace-pre-line">
      <h1 className="text-2xl font-bold mb-6">{t.privacyTitle}</h1>
      <p className="mb-4 text-sm text-yellow-400">{t.privacyLastUpdate}</p>
      <p>{fullText}</p>
    </div>
  )
}
