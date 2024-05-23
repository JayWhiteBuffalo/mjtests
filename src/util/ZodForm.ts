import {zodResolver} from '@hookform/resolvers/zod'
import ObjectUtil from '@util/ObjectUtil'
import {useCallback} from 'react'
import {
  get,
  useForm,
  type FieldPath,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type SubmitHandler,
  type UseFormProps,
  type UseFormRegister,
  type UseFormReturn,
} from 'react-hook-form'
import {ZodError, type ZodIssue, type ZodType, type ZodTypeDef} from 'zod'

/*
Variant of react-hook-form's useForm that is specialized for:
- Zod schema validation
- Next.js server actions
- Typescript
*/

export type ZodServerAction<ApiData, Result = undefined> = (
  apiData: ApiData,
) => Promise<ZodResponse<Result>>

// Zod issues array
export type ZodIssuesResponse = {issues: ZodIssue[]}
// General purpose form error
export type ZodErrorResponse = {error: string}
export type ZodResponse<Return> = ZodErrorResponse | ZodIssuesResponse | Return

export const emitZodError =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any


    <Return, Params extends any[]>(
      action: (...args: Params) => Promise<Return>,
    ): ((...args: Params) => Promise<ZodResponse<Return>>) =>
    async (...args: Params) => {
      try {
        return await action(...args)
      } catch (error) {
        if (error instanceof ZodError) {
          return {issues: error.issues}
        }
        throw error
      }
    }

type PathCodeMessage = {path: string; type: string; message: string}

export const extractErrors = (
  response: ZodResponse<unknown>,
): PathCodeMessage[] => {
  const errors: PathCodeMessage[] = []

  // Zod issues array
  if (
    typeof response === 'object' &&
    response &&
    'issues' in response &&
    response.issues instanceof Array
  ) {
    for (const {code, message, path} of response.issues) {
      errors.push({
        path: path.join('.') || 'root',
        type: code,
        message,
      })
    }
  }

  // General purpose form error
  if (
    typeof response === 'object' &&
    response &&
    'error' in response &&
    typeof response.error === 'string'
  ) {
    errors.push({
      path: 'root.form',
      type: 'form',
      message: response.error,
    })
  }

  return errors
}

export type UseZodFormReturn<
  TFormData extends FieldValues,
  TApiData extends FieldValues,
> = Omit<UseFormReturn<TFormData, undefined, TApiData>, 'handleSubmit'> & {
  handleAction: (action: ZodServerAction<TApiData, unknown>) => () => void
}

export type UseZodFormProps<
  TFormData extends FieldValues,
  TApiData extends FieldValues,
> = Omit<UseFormProps<TFormData, undefined>, 'resolver'> & {
  schema: ZodType<TApiData, ZodTypeDef, TFormData>
}

export const useZodForm = <
  TFormData extends FieldValues = FieldValues,
  TApiData extends FieldValues = TFormData,
>({
  schema,
  ...props
}: UseZodFormProps<TFormData, TApiData>): UseZodFormReturn<
  TFormData,
  TApiData
> => {
  const {
    handleSubmit: rhfHandleSubmit,
    register: rhfRegister,
    ...methods
  } = useForm<TFormData, undefined, TApiData>({
    ...props,
    resolver: zodResolver(schema),
  })
  const {setError, control} = methods

  const handleAction = useCallback(
    (action: ZodServerAction<TApiData, unknown>) => {
      const submitHandler: SubmitHandler<TApiData> = async (
        formData: TApiData,
      ) => {
        try {
          const response = await action(formData)
          const errors = extractErrors(response)
          for (const {path, type, message} of errors) {
            setError(path as Path<TFormData>, {type, message})
          }
        } catch (error) {
          setError('root.server', {type: 'server', message: error.message})
        }
      }

      // So unncessary
      const submitHandler2 = submitHandler as TApiData extends undefined
        ? SubmitHandler<TFormData>
        : TApiData extends FieldValues
          ? SubmitHandler<TApiData>
          : never

      return () => {
        rhfHandleSubmit(submitHandler2)()

        const {errors} = control._formState
        if (ObjectUtil.isNotEmpty(errors)) {
          console.error(errors, control._formValues)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setError, rhfHandleSubmit],
  )

  const register: UseFormRegister<TFormData> = useCallback(
    <TFieldName extends FieldPath<TFormData>>(
      name: TFieldName,
      options?: RegisterOptions<TFormData, TFieldName>,
    ) => ({
      ...rhfRegister(name, options),
      defaultValue: get(control._defaultValues, name),
    }),
    [rhfRegister, control],
  )

  return {...methods, handleAction, register}
}
