// src/lib/tasks.ts

export async function startDay(pais: string): Promise<void> {
    const res = await fetch('/api/startDay', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pais }),
    })
  
    if (!res.ok) {
      const data = await res.json()
      console.error('Error al iniciar día:', data)
      throw new Error('No se pudieron generar las tareas')
    }
  }
  
  export type Task = {
    id: string
    tipo: string
    red: string
    payout: number
    url_inicio: string
    estado: string
  }
  
  export async function fetchTasks(): Promise<Task[]> {
    const today = new Date().toISOString().slice(0, 10)
  
    const res = await fetch(`/api/tasks?date=${today}`, {
      method: 'GET',
      credentials: 'include',
    })
  
    if (!res.ok) {
      console.error('Error al obtener tareas')
      return []
    }
  
    const data = await res.json()
    return data.tasks || []
  }
  