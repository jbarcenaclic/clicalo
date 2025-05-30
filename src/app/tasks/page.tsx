'use client'

import { useEffect, useState } from 'react'
import { useLoginContext } from '@/context/LoginContext'
import { texts } from '@/src/i18n/texts'
import { cn } from '@/lib/utils'

type Task = {
  id: string
  date: string
  status: string
  start_url: string
  completed_at: string | null
}

export default function TasksPage() {
  const { user } = useLoginContext()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadTasks = async () => {
    const res = await fetch('/api/tasks/today', {
      headers: { 'x-user-id': user?.id },
    })
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }

  const markTaskCompleted = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' })
    await loadTasks()
  }

  useEffect(() => {
    if (user) loadTasks()
  }, [user])

  if (loading) return <p>{texts.loading}</p>

  const activeTask = tasks.find((t) => t.status === 'pending')

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      {/* Progreso visual */}
      <div className="grid grid-cols-5 gap-1">
        {tasks.map((task, i) => (
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
            {texts.markAsCompleted}
          </button>
        </div>
      ) : (
        <p>{texts.allTasksCompleted}</p>
      )}
    </div>
  )
}
