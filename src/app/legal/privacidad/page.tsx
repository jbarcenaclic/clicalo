// src/app/legal/privacidad/page.tsx
'use client'

import { texts } from '@/i18n/texts'

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">{texts.legal.privacy.title}</h1>
      <p className="mb-4 text-sm text-yellow-400">{texts.legal.privacy.lastUpdate}</p>

      <h2 className="font-bold text-lg mt-6 mb-2">1. {texts.legal.privacy.responsibility}</h2>
      <p className="mb-4">{texts.legal.privacy.responsibilityText}</p>

      <h2 className="font-bold text-lg mt-6 mb-2">2. {texts.legal.privacy.dataCollected}</h2>
      <p className="mb-4">{texts.legal.privacy.dataCollectedText}</p>

      <h2 className="font-bold text-lg mt-6 mb-2">3. {texts.legal.privacy.purpose}</h2>
      <p className="mb-4">{texts.legal.privacy.purposeText}</p>
    </div>
  )
}
