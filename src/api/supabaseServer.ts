import {cookies} from "next/headers"
import {createServerClient as createServerClient_, type CookieOptions} from '@supabase/ssr'
import {supabaseUrl} from './Env'

export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerClient_<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export const createRouteHandlerClient = () => {
  const cookieStore = cookies()

  return createServerClient_<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

export const createServerActionClient = createRouteHandlerClient

export default createServerClient
