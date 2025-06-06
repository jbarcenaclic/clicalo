'use client'
import { useState } from 'react'
import { sendOtp } from './actions'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    const { error } = await sendOtp(phone)
    if (error) return setMessage(`Error: ${error.message}`)
    router.push(`/verify?phone=${encodeURIComponent(phone)}`)
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-2">Login</h1>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+52..."
        className="border p-2 mb-2 block text-black bg-white rounded"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Enviar OTP
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}
