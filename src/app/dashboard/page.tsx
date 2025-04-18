import DashboardRuta from '@/components/DashboardRuta'

export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">🎯 Tu progreso diario</h1>
      <DashboardRuta tiradasCompletadas={4} accionesEnCurso={2} />
    </div>
  )
}
