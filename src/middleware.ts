// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
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

  return NextResponse.next()
}

