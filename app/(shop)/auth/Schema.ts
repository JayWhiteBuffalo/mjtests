import {z} from 'zod'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const signUpSchema = z
  .object({
    confirmPassword: z
      .string()
      .min(1, {message: 'Required'})
      .min(6, {message: 'Password must have 6 or more characters'}),
    email: z.string().min(1, {message: 'Required'}).email(),
    password: z
      .string()
      .min(1, {message: 'Required'})
      .min(6, {message: 'Password must have 6 or more characters'}),
    /*
  legal: z.literal(true, {
    errorMap: () => ({message: 'Required'}),
  }),
  */
  })
  .refine(form => form.password === form.confirmPassword, {
    message: "Passwords don't match",
    path: ['root'],
  })

export const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export const updatePasswordSchema = z
  .object({
    confirmPassword: z
      .string()
      .min(1, {message: 'Required'})
      .min(6, {message: 'Password must have 6 or more characters'}),
    password: z
      .string()
      .min(1, {message: 'Required'})
      .min(6, {message: 'Password must have 6 or more characters'}),
  })
  .refine(form => form.password === form.confirmPassword, {
    message: "Passwords don't match",
    path: ['root'],
  })

export const signInWithOAuthSchema = z.enum(['google', 'github'])
export type OAuthProvider = 'google' | 'github'
