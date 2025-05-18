// src/components/AccionFrame.tsx
import { ReactNode } from 'react'

export default function AccionFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-clicalo-azul mb-6">
      {children}
    </div>
  )
}