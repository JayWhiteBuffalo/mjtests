import type {Database} from '../supabase/schema'
import {createServerClient, type CookieOptions} from '@supabase/ssr'
import {NextResponse} from 'next/server'
import {supabaseUrl} from './Env'
import {throwOnError} from '@util/SupabaseUtil'

export const updateSession = async ({request}) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  //await supabase.auth.refreshSession()
  const user = (await supabase.auth.getUser()).data?.user

  return {user, response, supabase}
}