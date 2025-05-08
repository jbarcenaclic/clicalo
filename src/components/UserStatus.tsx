// src/components/UserStatus.tsx
'use client'
import { useLogin } from '@/context/LoginContext'

export default function UserStatus() {
  const { isLoggedIn, phone, logout } = useLogin()

  return (
    <span className="text-sm flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <span>🔓 {phone}</span>
          <button className="underline text-xs" onClick={logout}>
            Salir
          </button>
        </>
      ) : (
        '🔒 No loggeado'
      )}
    </span>
  )
}