import {NextRequest, NextResponse} from 'next/server'
import {type EmailOtpType} from '@supabase/supabase-js'
import {createRouteHandlerClient} from '@api/supabaseServer'
import {defaultReturnTo} from '@/feature/shared/component/Site'
import {throwOnError} from '@util/SupabaseUtil'

// Endpoint for PKCE workflows, implemented around supabase.auth.verifyOtp
// See https://supabase.com/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr
export const GET = async (request: NextRequest) => {
  const {searchParams} = new URL(request.url)
  const host = request.headers.get('Host')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')
  const returnTo = searchParams.get('returnTo')

  if (token_hash && type) {
    const supabase = createRouteHandlerClient()

    try {
      await supabase.auth.verifyOtp({type, token_hash}).then(throwOnError)

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

  // return the user to an error page with some instructions
  return NextResponse.redirect(`http://${host}/auth/auth-code-error`)
}
