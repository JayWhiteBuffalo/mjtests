import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ':').split(':');

export const middleware = (req: NextRequest) => {
  if (!isAuthenticated(req)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {'WWW-Authenticate': 'Basic'},
    })
  }

  return NextResponse.next()
}

const isAuthenticated = (req: NextRequest) => {
  const authheader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!authheader) {
    return false
  }

  const [user, pass] = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':')
  return user == AUTH_USER && pass == AUTH_PASS
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
