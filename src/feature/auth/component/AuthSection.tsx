import {Divider} from '@nextui-org/react'
import type {ReactNode} from 'react'

export const AuthDivider = () => (
  <div className="flex items-center gap-4 py-2">
    <Divider className="flex-1" />
    <p className="shrink-0 text-tiny text-default-500">OR</p>
    <Divider className="flex-1" />
  </div>
)

export type AuthFormProps = {
  children: ReactNode
}

export const AuthTitle = ({children}: AuthFormProps) => (
  <h2 className="pb-2 text-xl font-medium">{children}</h2>
)

export type AuthSectionProps = {
  children: ReactNode
}

export const AuthSection = ({children}: AuthSectionProps) => (
  <section className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
    {children}
  </section>
)
