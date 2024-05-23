'use client'
import NextLink from 'next/link'
import {defaultReturnTo} from '@/feature/shared/component/Site'
import {HiOutlineCheckCircle} from 'react-icons/hi'
import {Link} from '@nextui-org/react'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'

export type TransitionMethod =
  | 'recovery'
  | 'default'
  | 'password'
  | 'otp'
  | 'exchange'
  | 'code'

export const toTransitionMethod = (method?: string): TransitionMethod =>
  method && method in messages ? (method as TransitionMethod) : 'default'

const messages: Record<TransitionMethod, string> = {
  code: 'Verifying code…',
  default: 'Processing…',
  exchange: 'Exchanging session…',
  otp: 'Verifying OTP…',
  password: 'Logging in…',
  recovery: 'Your password has been updated.',
}

type TransitionProps = {
  method?: TransitionMethod
  returnTo?: string
  autoReturn: boolean
}

export const Transition = ({
  method,
  returnTo = defaultReturnTo,
  autoReturn = true,
}: TransitionProps) => {
  const router = useRouter()

  useEffect(() => {
    if (autoReturn) {
      const timeoutID = setTimeout(() => router.push(returnTo), 5e3)
      return () => clearTimeout(timeoutID)
    }
  }, [router, returnTo, autoReturn])

  return (
    <div className="flex items-center flex-col text-white w-72 gap-4">
      <HiOutlineCheckCircle className="w-24 h-24 text-success" />

      <p>{messages[method ?? 'default']}</p>

      {autoReturn ? <p>Redirecting…</p> : undefined}

      <Link as={NextLink} href={returnTo}>
        Continue
      </Link>

      {returnTo !== defaultReturnTo ? (
        <Link as={NextLink} href={defaultReturnTo}>
          Return Home
        </Link>
      ) : undefined}
    </div>
  )
}
