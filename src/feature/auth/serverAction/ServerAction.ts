'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {headers} from 'next/headers'
import {createServerActionClient} from '@api/SupabaseServer'
import {defaultReturnTo} from '@/components/Site'
import {
  signInSchema,
  signUpApiSchema,
  resetPasswordSchema,
  signInWithOAuthSchema,
  type UpdatePasswordApiData,
  updatePasswordApiSchema,
  type SignInData,
  type SignUpApiData,
  type ResetPasswordData,
} from '../Schema'
import {throwOnError} from '@util/SupabaseUtil'
import {
  AuthError,
  type AuthResponse,
  type AuthTokenResponsePassword,
  type OAuthResponse,
  type Provider,
} from '@supabase/supabase-js'
import type {ZodResponse} from '@/util/ZodForm'

export const signIn = async (
  apiData: SignInData,
  returnTo = defaultReturnTo,
) => {
  const supabase = createServerActionClient()
  const result = signInSchema.safeParse(apiData)
  if (!result.success) {
    return {issues: result.error.issues}
  }

  try {
    await supabase.auth
      .signInWithPassword(result.data)
      .then(throwOnError<AuthTokenResponsePassword['data'], AuthError>)
  } catch (error) {
    return {error: error.message}
  }

  revalidatePath(returnTo, 'layout')
  redirect(returnTo)
}

const makeReturnToUrl = (returnTo: string) =>
  `http://${headers().get('Host')}${returnTo}`

export const signUp = async (
  apiData: SignUpApiData,
  returnTo: string = defaultReturnTo,
): Promise<ZodResponse<AuthResponse['data']>> => {
  const supabase = createServerActionClient()
  const result = signUpApiSchema.safeParse(apiData)
  if (!result.success) {
    return {issues: result.error.issues}
  }

  try {
    return await supabase.auth
      .signUp({
        ...result.data,
        options: {emailRedirectTo: makeReturnToUrl(returnTo)},
      })
      .then(throwOnError)
  } catch (error) {
    return {error: error.message}
  }
}

export const signOut = async () => {
  const supabase = createServerActionClient()

  try {
    await supabase.auth.signOut().then(throwOnError)
  } catch (error) {
    return {error: error.message}
  }
  redirect('/auth')
}

export const resetPassword = async (
  apiData: ResetPasswordData,
  returnTo: string = defaultReturnTo,
) => {
  const supabase = createServerActionClient()
  const result = resetPasswordSchema.safeParse(apiData)
  if (!result.success) {
    return {issues: result.error.issues}
  }

  try {
    await supabase.auth
      .resetPasswordForEmail(result.data.email, {
        redirectTo: makeReturnToUrl(returnTo),
      })
      .then(throwOnError)
  } catch (error) {
    return {error: error.message as string}
  }
}

export const updatePassword = async (
  apiData: UpdatePasswordApiData,
  returnTo: string = defaultReturnTo,
): Promise<ZodResponse<undefined>> => {
  const supabase = createServerActionClient()
  const result = updatePasswordApiSchema.safeParse(apiData)
  if (!result.success) {
    return {issues: result.error.issues}
  }

  const {error} = await supabase.auth.updateUser(result.data)
  if (error) {
    return {error: error.message}
  }

  redirect(`/auth/transition?method=recovery&returnTo=${returnTo}`)
}

const makePkceRedirect = (returnTo: string) =>
  `http://${headers().get('Host')}/auth/callback?next=${encodeURIComponent(returnTo)}`

export const signInWithOAuth = async (
  provider: Provider,
  returnTo = defaultReturnTo,
) => {
  const supabase = createServerActionClient()
  provider = signInWithOAuthSchema.parse(provider)

  const {url} = await supabase.auth
    .signInWithOAuth({
      provider,
      options: {
        redirectTo: makePkceRedirect(returnTo),
      },
    })
    .then(throwOnError<OAuthResponse['data'], AuthError>)

  if (url) {
    redirect(url)
  }
}
