'use client'
import Image from 'next/image'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-[600px] aspect-[864/289] mx-auto mb-4 ${className}`}>
      <Image
        src="/logo-clicalo.png"
        alt="CLÍCALO logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
