import Link from 'next/link';
import {Button} from '@nextui-org/react'
import {RiErrorWarningLine} from 'react-icons/ri'
import {defaultReturnTo} from '@components/Site'

const AuthCodeErrorPage = () =>
  <div className="flex items-center flex-col text-white w-72 gap-4">
    <RiErrorWarningLine className="w-24 h-24 text-danger" />

    <h4 className="text-lg">Authentication Error</h4>

    <p>
      Oops! There seems to be an issue with the authentication code you
      provided.
    </p>

    <p>
      This could be due to an expired code, a typographical error, or an
      invalid request. Please ensure you&apos;ve used the most recent code
      sent to your email. If the issue persists, consider the following
      options:
    </p>

    <Link href="/auth" passHref>
      <Button color="primary">
        Try again
      </Button>
    </Link>

    <Link href={defaultReturnTo} passHref>
      <Button color="primary">
        Go to Home
      </Button>
    </Link>
  </div>

export default AuthCodeErrorPage
