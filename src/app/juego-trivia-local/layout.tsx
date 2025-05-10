// src/app/juego-trivia-local/layout.tsx
console.log('[🧪 layout local activo]')

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white">
        {children}
      </body>
    </html>
  )
}
