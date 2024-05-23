'use client'
import NextLink from 'next/link'
import {AlertBox} from '@components/Form'
import {AuthSection, AuthTitle} from './AuthSection'
import {HiOutlineMail} from 'react-icons/hi'
import {Input, Link, Button} from '@nextui-org/react'
import {zodResolver} from '@hookform/resolvers/zod'
import {FormErrors, useForm} from '@components/Form'
import {resetPassword as resetPasswordAction} from '@/feature/auth/serverAction/ServerAction'
import {resetPasswordSchema} from '@/feature/auth/Schema'
import {useCallback} from 'react'

const StatusAlertBox = ({status}) =>
  status === 'checkEmail' ? (
    <AlertBox color="warning">
      <p>Check your email for the password reset link</p>
    </AlertBox>
  ) : undefined

export const ResetPasswordForm = ({returnTo}) => {
  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const resetPassword = useCallback(
    formData => resetPasswordAction(formData, returnTo),
    [returnTo],
  )

  return (
    <form className="flex flex-col gap-3" action={handleSubmit(resetPassword)}>
      <Input
        {...register('email')}
        isRequired
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
      />

      <Button
        className="w-full my-4"
        color="primary"
        isLoading={isSubmitting}
        startContent={<HiOutlineMail className="text-xl" />}
        type="submit"
      >
        Send reset password instructions
      </Button>

      <FormErrors errors={errors} />
      {isSubmitSuccessful ? <StatusAlertBox status="checkEmail" /> : undefined}
    </form>
  )
}

export const ResetPassword = ({returnTo}) => (
  <AuthSection>
    <header>
      <AuthTitle>Reset Password</AuthTitle>
    </header>
    <ResetPasswordForm returnTo={returnTo} />

    <p className="text-center">
      <Link
        as={NextLink}
        href={{
          pathname: '/auth',
          query: returnTo ? {returnTo} : {},
        }}
        size="sm"
      >
        Go back to sign in
      </Link>
    </p>
  </AuthSection>
)
