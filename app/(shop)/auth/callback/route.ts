import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {createRouteHandlerClient} from '@api/supabaseServer'
import {defaultReturnTo} from '@/feature/shared/component/Site'
import {throwOnError} from '@util/SupabaseUtil'
import type {AuthError, AuthTokenResponse} from '@supabase/supabase-js'

// Endpoint for non-PKCE workflows
export const GET = async (request: NextRequest) => {
  const {searchParams} = new URL(request.url)
  const host = request.headers.get('Host')
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const returnTo = searchParams.get('returnTo')

  if (code) {
    const supabase = createRouteHandlerClient()
    try {
      await supabase.auth
        .exchangeCodeForSession(code)
        .then(throwOnError<AuthTokenResponse['data'], AuthError>)

      if (next) {
        return NextResponse.redirect(
          `http://${host}${next}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`,
        )
      } else {
        return NextResponse.redirect(returnTo ?? defaultReturnTo)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return NextResponse.redirect(`http://${host}/auth/auth-code-error`)
}
