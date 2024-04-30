'use client'
import NextLink from 'next/link'
import {defaultReturnTo} from '@components/Site'
import {HiOutlineCheckCircle} from 'react-icons/hi'
import {Link} from '@nextui-org/react'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'

const messages: Record<string, string> = {
  recovery: 'Your password has been updated.',
  default: 'Processing…'
  /*
  password: 'Logging in…',
  otp: 'Verifying OTP…',
  exchange: 'Exchanging session…',
  code: 'Verifying code…',
  */
}

export const Transition = ({method, returnTo = defaultReturnTo, autoReturn = true}) => {
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

      <p>
        {messages[method ?? 'default']}
      </p>

      {
        autoReturn 
          ? <p>Redirecting…</p>
          : undefined
      }

      <Link as={NextLink} href={returnTo}>
        Continue
      </Link>

      {
        returnTo !== defaultReturnTo
          ? <Link as={NextLink} href={defaultReturnTo}>
              Return Home
            </Link>
          : undefined
      }
    </div>
  )
}

