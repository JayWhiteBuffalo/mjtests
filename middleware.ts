import {createMiddlewareClient} from '@api/supabaseMiddleware'
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

// HTTP Basic authentication
const httpBasicAuth = (request: NextRequest) => {
  const {HTTP_BASIC_AUTH} = process.env
  if (!HTTP_BASIC_AUTH) {
    return true
  }

  const [staticUser, staticPass] = (HTTP_BASIC_AUTH || ':').split(':');
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  if (!authHeader) {
    return false
  }

  const [user, pass] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
  return user == staticUser && pass == staticPass
}

const shouldRedirectLoggedOut = pathname => {
  if (pathname.startsWith('/admin')) {
    return true
  }

  // Don't redirect /api regardless of authentication
  if (pathname.startsWith('/api')) {
    return false
  }

  return false
}

export async function middleware(request) {
  if (!httpBasicAuth(request)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {'WWW-Authenticate': 'Basic'},
    })
  }

  if (request.nextUrl.pathname === '/.well-known/change-password') {
    return NextResponse.redirect(new URL('/auth/change-password'))
  }

  const response = NextResponse.next()
  const supabase = createMiddlewareClient({request, response})
  await supabase.auth.getUser()

  // Refresh sesssion if expired
  const {data: {session}} = await supabase.auth.getSession()

  // Redirect to login page for logged out users accessing protected routes
  if (shouldRedirectLoggedOut(request.nextUrl.pathname) && !session) {
    const redirectUrl = new URL('/auth', request.nextUrl)
    redirectUrl.searchParams.set('returnTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
