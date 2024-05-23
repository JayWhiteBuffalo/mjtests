import {z} from 'zod'

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
export type SignInData = z.infer<typeof signInSchema>

export const signUpFormSchema = z
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
    legal: z.literal(true, {
      errorMap: () => ({message: 'Required'}),
    }),
  })
  .refine(form => form.password === form.confirmPassword, {
    message: "Passwords don't match",
    path: ['root'],
  })
  .transform(({confirmPassword: _1, legal: _2, ...rest}) => rest)

export const signUpApiSchema = z.object({
  email: z.string().min(1, {message: 'Required'}).email(),
  password: z
    .string()
    .min(1, {message: 'Required'})
    .min(6, {message: 'Password must have 6 or more characters'}),
})

export type SignUpFormData = z.input<typeof signUpFormSchema>
export type SignUpApiData = z.output<typeof signUpFormSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>

export const updatePasswordFormSchema = z
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
  .transform(({confirmPassword: _, ...rest}) => rest)

export const updatePasswordApiSchema = z.object({
  password: z.string().min(1).min(6),
})

export type UpdatePasswordFormData = z.input<typeof updatePasswordFormSchema>
export type UpdatePasswordApiData = z.output<typeof updatePasswordFormSchema>

export const signInWithOAuthSchema = z.enum(['google', 'github'])
export type OAuthProvider = 'google' | 'github'
