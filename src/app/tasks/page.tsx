'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLogin} from '@/context/LoginContext'
import { texts } from '@/i18n/texts'
import { cn } from '@/lib/utils'

type Task = {
  id: string
  date: string
  status: string
  start_url: string
  completed_at: string | null
}

export default function TasksPage() {
  const { preferred_language } = useLogin()
  const t = texts[preferred_language || 'es'] // fallback to 'es'
  const { userId } = useLogin()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadTasks = useCallback(async () => {
    const res = await fetch('/api/tasks/today', {
      headers: { 'x-user-id': userId || '' },
    })
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }, [userId])	

  const markTaskCompleted = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' })
    await loadTasks()
  }

  useEffect(() => {
    if (userId) loadTasks()
  }, [userId, loadTasks])

  if (loading) return <p>{t.loading}</p>

  const activeTask = tasks.find((t) => t.status === 'pending')

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      {/* Progreso visual */}
      <div className="grid grid-cols-5 gap-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'h-3 rounded-full',
              task.status === 'completed'
                ? 'bg-green-500'
                : task.status === 'pending'
                ? 'bg-yellow-400'
                : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Tarea activa */}
      {activeTask ? (
        <div className="space-y-2">
          <iframe
            src={activeTask.start_url}
            className="w-full h-[400px] border rounded-md"
          />
          <button
            onClick={() => markTaskCompleted(activeTask.id)}
            className="w-full bg-green-600 text-white rounded py-2 font-semibold"
          >
            {t.markAsCompleted}
          </button>
        </div>
      ) : (
        <p>{t.allTasksCompleted}</p>
      )}
    </div>
  )
}
