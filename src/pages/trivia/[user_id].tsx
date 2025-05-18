// pages/trivia/[user_id].tsx

import { useRouter } from 'next/router'
import JuegoTriviaLocalEmbedded from '@/components/JuegoTriviaLocalEmbedded'

export default function TriviaPage() {
  const router = useRouter()
  const { user_id } = router.query

  return <JuegoTriviaLocalEmbedded actionId={`trivia_local_${user_id}`} onComplete={() => {
    // Lógica para manejar la finalización de la trivia
    // Por ejemplo, redirigir al usuario o mostrar un mensaje
  }} />
}
