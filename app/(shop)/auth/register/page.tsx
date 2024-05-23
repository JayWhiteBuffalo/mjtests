import {EmailAuth} from '@components/auth/EmailAuth'

export default async ({searchParams}) => (
  <EmailAuth returnTo={searchParams.returnTo} view="signUp" />
)
