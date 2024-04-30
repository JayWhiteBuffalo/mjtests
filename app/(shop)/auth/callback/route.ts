import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {createRouteHandlerClient} from '@api/supabaseServer'
import {defaultReturnTo} from '@components/Site'
import {throwOnError} from '@util/SupabaseUtil'

// Endpoint for non-PKCE workflows
export async function GET(request: NextRequest) {
  const {searchParams, origin} = new URL(request.url);
  const code = searchParams.get("code")
  const next = searchParams.get("next")
  const returnTo = searchParams.get('returnTo')

  if (code) {
    const supabase = createRouteHandlerClient()
    try {
      await supabase.auth.exchangeCodeForSession(code)
        .then(throwOnError)

      if (next) {
        return NextResponse.redirect(`${origin}${next}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`)
      } else {
        return NextResponse.redirect(returnTo ?? defaultReturnTo)
      }
    } catch (error) {}
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
