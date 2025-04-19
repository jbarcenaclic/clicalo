'use client'
import { useEffect, useState } from 'react'
import { DashboardRuta } from '@/components/DashboardRuta'


export default function DashboardPage() {
  const [tiradas, setTiradas] = useState(0)
  const [acciones, setAcciones] = useState(0)

  useEffect(() => {
    const phone = localStorage.getItem('phone')
    if (!phone) return
    const encodedPhone = encodeURIComponent(phone)
    fetch(`/api/user-progress?phone=${encodedPhone}`)
      .then(res => res.json())
      .then(data => {
        setTiradas(data.tiradasCompletadas || 0)
        setAcciones(data.accionesEnCurso || 0)
      })
  }, [])

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-2">🎯 Tu progreso diario</h1>
      <DashboardRuta tiradasCompletadas={tiradas} accionesEnCurso={acciones} />
    </div>
  )
}
