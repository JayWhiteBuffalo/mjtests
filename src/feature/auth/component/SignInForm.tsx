import {FormErrors} from '@/feature/shared/component/Form'
import {useZodForm} from '@/util/ZodForm'
import {signInSchema, type SignInData} from '@/feature/auth/Schema'
import {PasswordInput} from './Input'
import {Input, Checkbox, Button, Link} from '@nextui-org/react'
import NextLink from 'next/link'
import {useCallback} from 'react'
import {signIn as signInAction} from '@/feature/auth/serverAction/ServerAction'

export type SignInFormProps = {
  returnTo?: string
}

export const SignInForm = ({returnTo}: SignInFormProps) => {
  const {
    handleAction,
    register,
    formState: {errors, isSubmitting},
  } = useZodForm({
    schema: signInSchema,
  })

  const signIn = useCallback(
    (formData: SignInData) => signInAction(formData, returnTo),
    [returnTo],
  )

  return (
    <form className="flex flex-col gap-3" action={handleAction(signIn)}>
      <Input
        {...register('email')}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        errorMessage={errors.email?.message as string | undefined}
        isInvalid={errors.email != null}
        isRequired
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
      />

      <PasswordInput
        {...register('password')}
        errorMessage={errors.password?.message as string | undefined}
        isInvalid={errors.password != null}
        isRequired
        label="Password"
        placeholder="Enter your password"
      />

      <div className="flex justify-between items-center px-2">
        {/* Remember me doens't do anything right now */}
        <Checkbox className="py-4" size="sm" defaultSelected>
          Remember me
        </Checkbox>
        <Link
          as={NextLink}
          href={
            {
              pathname: '/auth/change-password',
              query: returnTo ? {returnTo} : {},
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
          }
          className="text-default-500"
          size="sm"
        >
          Forgot password?
        </Link>
      </div>

      <Button color="primary" isLoading={isSubmitting} type="submit">
        Log In
      </Button>

      <FormErrors errors={errors} />
    </form>
  )
}
