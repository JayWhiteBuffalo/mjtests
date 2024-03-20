import clsx from 'clsx'
import ObjectUtil from '@util/ObjectUtil'
import {CgClose} from 'react-icons/cg'
import {Children, cloneElement, useId, forwardRef, useCallback} from 'react'
import {get, useForm, useWatch} from 'react-hook-form'
import {Label, Checkbox, Radio} from 'flowbite-react'

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

export const FieldError = ({id, error, path}) =>
  error?.message != null &&
    <p id={id} className="FieldError text-red-700 dark:text-red-500">
      {path?.length ? path.join('.') + ': ' : undefined}
      {error.message}
    </p>


export const RecursiveErrors = ({errors, showPath}) =>
  <>
    {[...ObjectUtil.dfs(errors)].map(([error, path]) =>
      <FieldError
        key={path.join('.')}
        error={error}
        path={!!showPath ? path : undefined}
        />
    )}
  </>

export const FieldDesc = ({children, id}) =>
  <p id={id} className="text-gray-600">{children}</p>

export const useTreemapForm = options => {
  const methods = useForm(options)
  const {setError, handleSubmit: handleSubmit_, control, register: register_} = methods
  const handleSubmit = useCallback(
    action => handleSubmit_(async formData => {
      try {
        const obj = await action(formData)
        if (typeof obj === 'object' && obj.issues instanceof Array) {
          // Zod issues array
          for (const {code, message, path} of obj.issues) {
            setError(path.join('.') || 'root', {type: code, message})
          }
        } else if (typeof obj === 'object' && typeof obj.error === 'string') {
          // General purpose form error
          setError('root.form', {type: 'form', message: obj.error})
        }
      } catch (error) {
        setError('root.server', {type: 'server', message: error.message})
      }
    }),
    [setError, handleSubmit_]
  )

  const register = useCallback(
    (name, options) => ({
      ...register_(name, options),
      defaultValue: get(control._defaultValues, name),
    }),
    [register_, control]
  )

  const registerChecked = useCallback(
    (name, value, options) => ({
      ...register_(name, options),
      defaultChecked: get(control._defaultValues, name) === value,
      value,
    }),
    [register_, control]
  )

  return {...methods, handleSubmit, register, registerChecked}
}

export const FormError = ({errors}) =>
  <RecursiveErrors errors={errors?.root} />

export const FormField = ({children}) =>
  <div className="my-4">
    {children}
  </div>

export const LabeledCheckbox = forwardRef(({children, disabled, id, className, ...rest}, ref) => {
  const id0 = useId()
  id ??= id0

  return (
    <Label
      className="flex items-center"
      disabled={disabled}
      htmlFor={id}>
      <Checkbox
        {...rest}
        className={clsx('mr-2 bg-gray-50', className)}
        disabled={disabled}
        id={id}
        ref={ref}
        />
      {children}
    </Label>
  )
})
LabeledCheckbox.displayName = 'LabeledCheckbox'

export const LabeledRadio = forwardRef(({children, disabled, id, className, ...rest}, ref) => {
  const id0 = useId()
  id ??= id0

  return (
    <Label
      className="flex items-center"
      disabled={disabled}
      htmlFor={id}>
      <Radio
        {...rest}
        className={clsx('mr-2 bg-gray-50', className)}
        disabled={disabled}
        id={id}
        ref={ref}
        />
      {children}
    </Label>
  )
})
LabeledRadio.displayName = 'LabeledRadio'

export const RemoveButton = ({onClick, className}) =>
  <button
    className={clsx('ml-2', className)}
    onClick={onClick}
    type="button">
    <CgClose size="1.5em" />
  </button>

export const nullResolver = () => async data => ({values: data, errors: {}})

export const Watch = ({control, render}) =>
  render(useWatch({control}))
