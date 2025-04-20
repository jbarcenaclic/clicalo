// src/components/Logo.tsx
'use client'
import Image from 'next/image'

export default function Logo() {
  return (
    <div className="relative w-48 h-16"> {/* puedes ajustar w/h según tu layout */}
      <Image
        src="/logo-clicalo.png"
        alt="CLÍCALO logo"
        fill
        sizes="(max-width: 768px) 120px, (max-width: 1200px) 160px, 200px"
        className="object-contain"
        priority
      />
    </div>
  )
}
