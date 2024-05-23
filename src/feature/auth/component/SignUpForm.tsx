import {FieldErrorMessage, FormErrors} from '@/feature/shared/component/Form'
import {useZodForm} from '@/util/ZodForm'
import {signUpFormSchema, type SignUpApiData} from '@/feature/auth/Schema'
import {PasswordInput} from './Input'
import {Input, Checkbox, Button, Link} from '@nextui-org/react'
import {Controller} from 'react-hook-form'
import {useState, useCallback} from 'react'
import {signUp as signUpAction} from '@/feature/auth/serverAction/ServerAction'
import {StatusAlertBox, type StatusKey} from './StatusAlertBox'

export type SignUpFormProps = {
  returnTo?: string
}

export const SignUpForm = ({returnTo}: SignUpFormProps) => {
  const {
    handleAction,
    register,
    formState: {errors, isSubmitting},
    control,
  } = useZodForm({
    defaultValues: {legal: true},
    schema: signUpFormSchema,
  })
  const [status, setStatus] = useState<StatusKey | undefined>()

  const signUp = useCallback(
    async (apiData: SignUpApiData) => {
      const result = await signUpAction(apiData, returnTo)
      if ('user' in result) {
        const {user, session} = result
        if (user && !session) {
          setStatus('checkEmail')
        } else if (user) {
          setStatus('success')
        }
      }
      return result
    },
    [returnTo],
  )

  return (
    <form className="flex flex-col gap-3" action={handleAction(signUp)}>
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

      <PasswordInput
        {...register('confirmPassword')}
        errorMessage={errors.confirmPassword?.message as string | undefined}
        isInvalid={errors.confirmPassword != null}
        isRequired
        label="Confirm Password"
        placeholder="Confirm your password"
      />

      <Controller
        control={control}
        name="legal"
        render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
          <div className="py-2 hidden">
            {/* Temporarily hide legal checkbox */}
            <Checkbox
              isSelected={value}
              onBlur={onBlur}
              onValueChange={onChange}
              size="sm"
            >
              I agree with the&nbsp;
              <Link href="/help/terms">Terms</Link>
              &nbsp; and&nbsp;
              <Link href="/help/privacy">Privacy Policy</Link>
            </Checkbox>
            <FieldErrorMessage
              error={error}
              className="text-tiny"
              id={undefined}
              path={undefined}
            />
          </div>
        )}
      />

      <Button color="primary" isLoading={isSubmitting} type="submit">
        Sign Up
      </Button>

      <FormErrors errors={errors} />
      <StatusAlertBox status={status} />
    </form>
  )
}
