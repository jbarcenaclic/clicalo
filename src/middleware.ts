// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Captura el OPTIONS / que lanza 400
  if (request.method === 'OPTIONS' && request.nextUrl.pathname === '/') {
    console.log('🛡️ Middleware: Interceptado OPTIONS /')

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
