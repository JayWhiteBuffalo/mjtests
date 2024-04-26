import {createRouteHandlerClient} from '@api/supabaseServer'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const {searchParams, origin} = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? '/';

  if (code) {
    const supabase = createRouteHandlerClient()
    try {
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {}
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
