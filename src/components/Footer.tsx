// src/components/Footer.tsx
'use client'

import { useLogin } from '@/context/LoginContext'
import { texts } from '@/i18n/texts'
import { Instagram, Twitter } from 'lucide-react'


export default function Footer() {
  const { preferred_language } = useLogin()
  const t = texts.footer[preferred_language || 'es']  // fallback a 'es'
  return (
    <footer className="bg-blue-900 text-white py-8 px-4 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-xl font-bold">CLÍCALO</h2>
          <p className="text-sm mt-2">{t.description}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t.legalTitle}</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/legal/terms" className="hover:underline">{t.terms}</a></li>
            <li><a href="/legal/privacy" className="hover:underline">{t.privacy}</a></li>
            <li><a href="/legal/antifraude" className="hover:underline">{t.antifraud}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t.contactTitle}</h3>
          <ul className="space-y-1 text-sm">
            <li>Email: <a href="mailto:contacto@clicalo.com" className="hover:underline">contacto@clicalo.com</a></li>
            <li><a href="https://wa.me/5215555555555" className="hover:underline">{t.support}</a></li>
            <li><a href="/ayuda" className="hover:underline">{t.helpCenter}</a></li>
            <li className="flex space-x-4 mt-2">
              <a href="https://x.com/clicalo" aria-label="X"><Twitter size={18} /></a>
              <a href="https://instagram.com/clicalo" aria-label="Instagram"><Instagram size={18} /></a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs mt-8 text-blue-300">
        © {new Date().getFullYear()} CLÍCALO · {t.rights}
      </div>
    </footer>
  )
}
