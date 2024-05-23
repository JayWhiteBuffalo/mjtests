'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {headers} from 'next/headers'
import {createServerActionClient} from '@api/supabaseServer'
import {defaultReturnTo} from '@components/Site'
import {
  signInSchema,
  signUpSchema,
  resetPasswordSchema,
  signInWithOAuthSchema,
  updatePasswordSchema,
} from './Schema'
import {throwOnError} from '@util/SupabaseUtil'

export const signIn = async (formData, returnTo = defaultReturnTo) => {
  const supabase = createServerActionClient()
  const result = signInSchema.safeParse(formData)
  if (!result.success) {
    return {issues: result.error.issues}
  }

  try {
    await supabase.auth.signInWithPassword(result.data).then(throwOnError)
  } catch (error) {
    return {error: error.message}
  }

  revalidatePath(returnTo, 'layout')
  redirect(returnTo)
}

const makeReturnToUrl = returnTo => `http://${headers().get('Host')}${returnTo}`

export const signUp = async (formData, returnTo = defaultReturnTo) => {
  const supabase = createServerActionClient()
  const result = signUpSchema.safeParse(formData)
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

export const resetPassword = async (formData, returnTo = defaultReturnTo) => {
  const supabase = createServerActionClient()
  const result = resetPasswordSchema.safeParse(formData)
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
    return {error: error.message}
  }
}

export const updatePassword = async (formData, returnTo = defaultReturnTo) => {
  const supabase = createServerActionClient()
  const result = updatePasswordSchema.safeParse(formData)
  if (!result.success) {
    return {issues: result.error.issues}
  }

  const {error} = await supabase.auth.updateUser(result.data)
  if (error) {
    return {error: error.message}
  }

  redirect(`/auth/transition?method=recovery&returnTo=${returnTo}`)
}

const makePkceRedirect = returnTo =>
  `http://${headers().get('Host')}/auth/callback?next=${encodeURIComponent(returnTo)}`

export const signInWithOAuth = async (provider, returnTo = defaultReturnTo) => {
  const supabase = createServerActionClient()
  provider = signInWithOAuthSchema.parse(provider)

  const {url} = await supabase.auth
    .signInWithOAuth({
      provider,
      options: {
        redirectTo: makePkceRedirect(returnTo),
      },
    })
    .then(throwOnError)

  if (url) {
    redirect(url)
  }
}
