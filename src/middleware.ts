// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Manejo especial para OPTIONS en /
  if (request.method === 'OPTIONS' && request.nextUrl.pathname === '/') {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() ?? 'IP desconocida'

    console.log('🕵️ Interceptado OPTIONS', {
      path: request.nextUrl.pathname,
      headers: Object.fromEntries(request.headers.entries()),
      ip,
    })

    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // Protección de rutas privadas
  const accessToken = request.cookies.get('sb-access-token')?.value
  const protectedRoutes = ['/tasks']
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/tasks/:path*'], // incluir '/' para el caso de OPTIONS
}
