'use client'
import NextLink from 'next/link'
import {AuthDivider, AuthSection, AuthTitle} from './AuthSection'
import {Link} from '@nextui-org/react'
import {SignInPlatformSection} from './SignInPlatformSection'
import {SignUpForm} from '@/feature/auth/component/SignUpForm'
import {SignInForm} from '@/feature/auth/component/SignInForm'

export type ViewType = 'signIn' | 'signUp'
export type EmailAuthProps = {
  view: ViewType
  returnTo?: string
}

export const EmailAuth = ({view, returnTo}: EmailAuthProps) => (
  <AuthSection>
    <header>
      <AuthTitle>{view === 'signIn' ? 'Sign In' : 'Sign Up'}</AuthTitle>
    </header>

    {view === 'signIn' ? (
      <SignInForm returnTo={returnTo} />
    ) : (
      <SignUpForm returnTo={returnTo} />
    )}

    <AuthDivider />
    <SignInPlatformSection returnTo={returnTo} />

    {view === 'signIn' ? (
      <p className="text-center text-small">
        Need to create an account?&nbsp;
        <Link
          as={NextLink}
          href={`/auth/register${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
          size="sm"
        >
          Sign Up
        </Link>
      </p>
    ) : (
      <p className="text-center text-small">
        Already have an account?&nbsp;
        <Link
          as={NextLink}
          href={`/auth${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
          size="sm"
        >
          Sign In
        </Link>
      </p>
    )}
  </AuthSection>
)
