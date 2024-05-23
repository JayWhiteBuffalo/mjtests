'use client'
import {AuthSection, AuthTitle} from './AuthSection'
import {Button} from '@nextui-org/react'
import {HiKey} from 'react-icons/hi'
import {PasswordInput} from './Input'
import {useCallback} from 'react'
import {FormErrors} from '@/feature/shared/component/Form'
import {useZodForm} from '@/util/ZodForm'
import {
  updatePasswordFormSchema,
  type UpdatePasswordApiData,
} from '@/feature/auth/Schema'
import {updatePassword as updatePasswordAction} from '@/feature/auth/serverAction/ServerAction'

export type UpdatePasswordFormProps = {
  returnTo?: string
}

export const UpdatePasswordForm = ({returnTo}: UpdatePasswordFormProps) => {
  const {
    handleAction,
    register,
    formState: {errors, isSubmitting},
  } = useZodForm({
    schema: updatePasswordFormSchema,
  })

  const updatePassword = useCallback(
    (apiData: UpdatePasswordApiData) => updatePasswordAction(apiData, returnTo),
    [returnTo],
  )

  return (
    <form className="flex flex-col gap-3" action={handleAction(updatePassword)}>
      <PasswordInput
        {...register('password')}
        errorMessage={errors.password?.message as string | undefined}
        isInvalid={errors.password != null}
        isRequired
        label="New Password"
        placeholder="Enter your new password"
      />

      <PasswordInput
        {...register('confirmPassword')}
        errorMessage={errors.confirmPassword?.message as string | undefined}
        isInvalid={errors.confirmPassword != null}
        isRequired
        label="Confirm Password"
        placeholder="Confirm your password"
      />

      <Button
        className="w-full"
        color="primary"
        isLoading={isSubmitting}
        startContent={<HiKey className="text-xl" />}
        type="submit"
      >
        Update password
      </Button>

      <FormErrors errors={errors} />
    </form>
  )
}

export type UpdatePasswordProps = {
  returnTo?: string
}

export const UpdatePassword = ({returnTo}: UpdatePasswordProps) => (
  <AuthSection>
    <header>
      <AuthTitle>Update Password</AuthTitle>
    </header>
    <UpdatePasswordForm returnTo={returnTo} />
  </AuthSection>
)
