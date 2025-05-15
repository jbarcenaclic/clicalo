// src/context/LoginContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type LoginContextType = {
  isLoggedIn: boolean
  userId: string | null
  phone: string | null
  setUserId: (id: string | null) => void
  logout: () => void
}

const LoginContext = createContext<LoginContextType>({
  isLoggedIn: false,
  userId: null,
  phone: null,
  setUserId: () => {},
  logout: () => {},
})

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/user-info', { credentials: 'include' })
        const json = await res.json()
        if (res.ok) {
          setUserId(json.user_id)
          setPhone(json.phone)
        }
      } catch (err) {
        console.error('Login error:', err)
        setUserId(null)
        setPhone(null)
      }
    }

    checkLogin()
  }, [])

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    setUserId(null)
    setPhone(null)
    router.push('/') // ✅ redirige al inicio
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn: !!userId, userId, phone, setUserId, logout }}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLogin = () => useContext(LoginContext)
