import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {createRouteHandlerClient} from '@api/supabaseServer'
import {defaultReturnTo} from '@components/Site'
import {throwOnError} from '@util/SupabaseUtil'

// Endpoint for non-PKCE workflows
export async function GET(request: NextRequest) {
  const {searchParams, origin} = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? defaultReturnTo;

  if (code) {
    const supabase = createRouteHandlerClient()
    try {
      await supabase.auth.exchangeCodeForSession(code)
        .then(throwOnError)
      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {}
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
