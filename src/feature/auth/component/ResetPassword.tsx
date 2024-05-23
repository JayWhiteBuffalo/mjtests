'use client'
import NextLink from 'next/link'
import {AlertBox} from '@/components/Form'
import {useZodForm} from '@/util/ZodForm'
import {AuthSection, AuthTitle} from './AuthSection'
import {HiOutlineMail} from 'react-icons/hi'
import {Input, Link, Button} from '@nextui-org/react'
import {FormErrors} from '@/components/Form'
import {resetPassword as resetPasswordAction} from '@/feature/auth/serverAction/ServerAction'
import {
  resetPasswordSchema,
  type ResetPasswordData,
} from '@/feature/auth/Schema'
import {useCallback} from 'react'

export type StatusKey = 'checkEmail'

export type StatusAlertBoxProps = {
  status?: StatusKey
}

const StatusAlertBox = ({status}: StatusAlertBoxProps) =>
  status === 'checkEmail' ? (
    <AlertBox color="warning">
      <p>Check your email for the password reset link</p>
    </AlertBox>
  ) : undefined

type ResetPasswordFormProps = {
  returnTo?: string
}

export const ResetPasswordForm = ({returnTo}: ResetPasswordFormProps) => {
  const {
    handleAction,
    register,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useZodForm({
    schema: resetPasswordSchema,
  })

  const resetPassword = useCallback(
    (apiData: ResetPasswordData) => resetPasswordAction(apiData, returnTo),
    [returnTo],
  )

  return (
    <form className="flex flex-col gap-3" action={handleAction(resetPassword)}>
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

type ResetPasswordProps = {
  returnTo?: string
}

export const ResetPassword = ({returnTo}: ResetPasswordProps) => (
  <AuthSection>
    <header>
      <AuthTitle>Reset Password</AuthTitle>
    </header>
    <ResetPasswordForm returnTo={returnTo} />

    <p className="text-center">
      <Link
        as={NextLink}
        href={`/auth${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
        size="sm"
      >
        Go back to sign in
      </Link>
    </p>
  </AuthSection>
)
