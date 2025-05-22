'use client'

import { useState } from 'react'
import { useLanguageCountry } from '@/hooks/useLanguageCountry'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageCountry()
  const [open, setOpen] = useState(false)

  const options = [
    { code: 'es', label: 'ESP', flag: '🇲🇽' },
    { code: 'en', label: 'ENG', flag: '🇺🇸' },
  ] as const

  const current = options.find(opt => opt.code === language)!

  return (
    <div className="relative text-white text-sm">
      <button
        className="flex items-center gap-1 px-2 py-1 hover:bg-zinc-800 rounded"
        onClick={() => setOpen(!open)}
        aria-label="Seleccionar language"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow z-50">
          {options.map(opt => (
            <button
              key={opt.code}
              className="flex items-center gap-2 px-3 py-1 w-full text-left hover:bg-zinc-700"
              onClick={() => {
                setLanguage(opt.code)
                setOpen(false)
              }}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
