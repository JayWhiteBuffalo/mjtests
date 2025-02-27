'use client'
import clsx from 'clsx'
import ObjectUtil from '@util/ObjectUtil'
import {CgClose} from 'react-icons/cg'
import {Children, cloneElement, useId, useCallback} from 'react'
import {get, useForm as useRhfForm, useWatch} from 'react-hook-form'
import {HiCheckCircle, HiInformationCircle} from 'react-icons/hi'

export const InputWithError = ({children, errors, name}) => {
  const error = get(errors, name)
  let input = Children.only(children)
  if (error) {
    input = cloneElement(input, {
      'aria-errormessage': `${name}.error`,
      color: 'failure',
    })
  }
  return (
    <>
      {input}
      <FieldError id={`${name}.error`} error={error} />
    </>
  )
}

export const FieldLayout = ({
  label,
  description,
  topDescription,
  bottomDescription,
  children,
  error,
}) => {
  const id = useId()
  const descriptionId = useId()
  const topDescriptionId = useId()
  const bottomDescriptionId = useId()
  const errorMessageId = useId()

  const describedByIds = []
  if (description) {
    describedByIds.push(descriptionId)
  }
  if (topDescription) {
    describedByIds.push(topDescriptionId)
  }
  if (bottomDescription) {
    describedByIds.push(bottomDescriptionId)
  }

  const input = cloneElement(Children.only(children), {
    'aria-describedby': describedByIds.length
      ? describedByIds.join(' ')
      : undefined,
    'aria-errormessage': error ? errorMessageId : undefined,
    //'aria-invalid': error != null,
    color: error ? 'danger' : undefined,
    id,
    isInvalid: error != null,
  })

  //const descriptionIsTop = bottomDescription && !topDescription
  const descriptionIsTop = true
  const descriptionNode = description ? (
    <FieldDescription id={descriptionId}>{description}</FieldDescription>
  ) : undefined

  return (
    <div className="my-4">
      {label ? (
        <label htmlFor={id} className="block">
          {label}
        </label>
      ) : undefined}
      {topDescription ? (
        <FieldDescription id={topDescriptionId}>
          {topDescription}
        </FieldDescription>
      ) : undefined}
      {descriptionIsTop ? descriptionNode : undefined}
      {input}
      <FieldError id={errorMessageId} error={error} />
      {!descriptionIsTop ? descriptionNode : undefined}
      {bottomDescription ? (
        <FieldDescription id={bottomDescriptionId}>
          {bottomDescription}
        </FieldDescription>
      ) : undefined}
    </div>
  )
}

export const FieldDescription = ({children, className, ...rest}) => (
  <p className={clsx('text-foreground-600 text-sm', className)} {...rest}>
    {children}
  </p>
)

export const FieldError = ({error, path, className, ...rest}) =>
  error?.message != null ? (
    <p className={clsx('FieldError text-sm text-danger', className)} {...rest}>
      {path?.length ? path.join('.') + ': ' : undefined}
      {error.message}
    </p>
  ) : undefined

export type FieldErrorMessageProps = {
  id?: string
  error?: FieldError
  path?: string[]
  className?: string
}

export const FieldErrorMessage = ({
  id,
  error,
  path,
  className,
}: FieldErrorMessageProps) =>
  error?.message != null ? (
    <p id={id} className={clsx('text-danger text-sm', className)}>
      {path?.length ? `${path.join('.')}: ` : undefined}
      {error.message}
    </p>
  ) : undefined


export const RecursiveErrors = ({errors, showPath}) => (
  <>
    {[...ObjectUtil.dfs(errors)].map(([error, path]) => (
      <FieldError
        key={path.join('.')}
        error={error}
        path={showPath ? path : undefined}
      />
    ))}
  </>
)

export const FormErrors = ({errors}) => (
  <RecursiveErrors errors={errors?.root} />
)

export const extractErrors = (obj, setError) => {
  if (typeof obj === 'object' && obj.issues instanceof Array) {
    // Zod issues array
    for (const {code, message, path} of obj.issues) {
      setError(path.join('.') || 'root', {type: code, message})
    }
  } else if (typeof obj === 'object' && typeof obj.error === 'string') {
    // General purpose form error
    setError('root.form', {type: 'form', message: obj.error})
  }
}

export const useForm = options => {
  const methods = useRhfForm(options)
  const {
    setError,
    handleSubmit: rhfHandleSubmit,
    control,
    register: rhfRegister,
  } = methods
  const handleSubmit = useCallback(
    action =>
      rhfHandleSubmit(async formData => {
        try {
          const obj = await action(formData)
          extractErrors(obj, setError)
        } catch (error) {
          setError('root.server', {type: 'server', message: error.message})
        }

        const {errors} = control._formState
        if (ObjectUtil.isNotEmpty(errors)) {
          console.error(errors)
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setError, rhfHandleSubmit],
  )

  const register = useCallback(
    (name, options) => ({
      ...rhfRegister(name, options),
      defaultValue: get(control._defaultValues, name),
    }),
    [rhfRegister, control],
  )

  return {...methods, handleSubmit, register}
}

export const RemoveButton = ({onClick, className}: {
  onClick: () => void
  className?: string
}) => (
  <button className={clsx('ml-2', className)} onClick={onClick} type="button">
    <CgClose size="1.5em" />
  </button>
)

export const nullResolver = () => async data => ({values: data, errors: {}})

export const Watch = ({control, render}) => render(useWatch({control}))

const defaultIcons = {
  success: HiCheckCircle,
  warning: HiInformationCircle,
}

type AlertBoxProps = {
  color: string
  Icon?: any
  className?: string
  children: any
}
export const AlertBox = ({
  color = 'default',
  Icon,
  className,
  children,
}: AlertBoxProps) => {
  Icon ??= defaultIcons[color] ?? HiInformationCircle

  return (
    <div
      className={clsx(
        `flex items-center p-2 rounded-lg border-${color} border-2`,
        className,
      )}
    >
      <Icon className={`text-${color} w-8 h-8 mr-2`} />
      <div>{children}</div>
    </div>
  )
}
