// src/components/UserStatus.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserInfo {
  user_id: string
  phone: string
  country: string
  preferred_language: string
}

export default function UserStatus() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/user-info')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setUser(data?.user_id ? data : null))
  }, [])

  const handleLogout = async () => {
    await fetch('/logout')
    router.refresh() // o router.push('/') si prefieres
  }

  return (
    <div className="text-sm text-white">
      {user ? (
        <div>
          👤 <span className="mr-2">{user.phone}</span>
          <button onClick={handleLogout} className="underline text-yellow-300">Logout</button>
        </div>
      ) : (
        <span className="text-orange-200">🔒 No loggeado</span>
      )}
    </div>
  )
}
