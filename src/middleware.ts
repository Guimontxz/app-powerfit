import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Permitir acesso livre às páginas públicas
  const publicPaths = ['/', '/login', '/signup']
  const path = request.nextUrl.pathname

  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  // Para rotas protegidas, verificar se há token de sessão
  const token = request.cookies.get('sb-access-token')
  
  if (!token && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
