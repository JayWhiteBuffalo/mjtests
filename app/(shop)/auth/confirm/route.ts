import { NextRequest, NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import {createRouteHandlerClient} from '@api/supabaseServer'
import {defaultReturnTo} from '@components/Site'
import {throwOnError} from '@util/SupabaseUtil'

// Endpoint for PKCE workflows, implemented around supabase.auth.verifyOtp
// See https://supabase.com/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')
  const returnTo = searchParams.get('returnTo')

  const {origin} = new URL(request.nextUrl)

  if (token_hash && type) {
    const supabase = createRouteHandlerClient()

    try {
      await supabase.auth.verifyOtp({type, token_hash})
        .then(throwOnError)

      if (next) {
        return NextResponse.redirect(`${origin}${next}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`)
      } else {
        return NextResponse.redirect(returnTo ?? defaultReturnTo)
      }
    } catch (error) {}
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
