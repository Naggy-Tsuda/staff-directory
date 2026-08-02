import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request)

  if (!user && request.nextUrl.pathname !== '/login') {
    return Response.redirect(new URL('/login', request.url))
  }

  if (user && request.nextUrl.pathname === '/login') {
    return Response.redirect(new URL('/staff', request.url))
  }

  if (user && request.nextUrl.pathname === '/') {
    return Response.redirect(new URL('/staff', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
