'use client'

import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/PrimaryButton'

export default function BlockedPage() {
  const router = useRouter()

  const handleRetry = () => {
    // Vuelve al home para reintentar detección IP
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">⚠️ Acceso restringido</h1>
      <p className="mb-4 max-w-xl">
        Parece que estás accediendo a CLÍCALO desde una VPN, Proxy o red protegida. 
        Para usar la plataforma, necesitamos verificar tu país real.
      </p>
      <p className="mb-6">
        Por favor desactiva cualquier VPN y vuelve a intentarlo.
      </p>
      <PrimaryButton onClick={handleRetry}>
        Reintentar sin VPN
      </PrimaryButton>
    </div>
  )
}
