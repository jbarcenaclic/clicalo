'use client'
import { ReactNode } from 'react'
import Logo from './Logo'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <Logo />
      {children}
    </main>
  )
}