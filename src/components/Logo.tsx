'use client'
import Image from 'next/image'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/logo-clicalo.png"
      alt="CLÍCALO logo"
      width={160}
      height={160}
      className={`mx-auto mb-4 ${className}`}
      priority
    />
  );
}