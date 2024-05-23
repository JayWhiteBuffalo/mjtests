import type {UseZodFormReturn} from '@/util/ZodForm'
import {createContext, useContext, type ReactNode} from 'react'
import type {FieldValues} from 'react-hook-form'

const ZodHookFormContext = createContext<UseZodFormReturn<
  FieldValues,
  FieldValues
> | null>(null)

export const useZodFormContext = <
  TFormData extends FieldValues,
  TApiData extends FieldValues,
>(): UseZodFormReturn<TFormData, TApiData> =>
  useContext(ZodHookFormContext) as UseZodFormReturn<TFormData, TApiData>

export type ZodFormProviderProps<
  TFormData extends FieldValues,
  TApiData extends FieldValues,
> = {
  children: ReactNode | ReactNode[]
} & UseZodFormReturn<TFormData, TApiData>

export const ZodFormProvider = <
  TFormData extends FieldValues,
  TApiData extends FieldValues,
>(
  props: ZodFormProviderProps<TFormData, TApiData>,
) => {
  const {children, ...data} = props
  return (
    <ZodHookFormContext.Provider
      value={data as unknown as UseZodFormReturn<FieldValues, FieldValues>}
    >
      {children}
    </ZodHookFormContext.Provider>
  )
}
