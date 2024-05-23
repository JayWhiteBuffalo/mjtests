import NextLink from 'next/link'
import {defaultReturnTo} from '@components/Site'
import {Link} from '@nextui-org/react'
import {RiErrorWarningLine} from 'react-icons/ri'

export const AuthCodeError = () => (
  <div className="flex items-center text-center flex-col text-white w-72 gap-4">
    <RiErrorWarningLine className="w-24 h-24 text-danger" />

    <h4 className="text-lg">Authentication Error</h4>

    <p>
      Oops! There seems to be an issue with the authentication code you
      provided.
    </p>

    <p>
      This could be due to an expired code, a typographical error, or an invalid
      request. Please ensure you&apos;ve used the most recent code sent to your
      email.
    </p>

    <Link as={NextLink} href="/auth">
      Try again
    </Link>

    <Link as={NextLink} href={defaultReturnTo}>
      Go to Home
    </Link>
  </div>
)
