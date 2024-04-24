import {EmailAuth} from '@components/auth/EmailAuth'

export default async ({searchParams}) =>
  <EmailAuth
    redirectTo={searchParams.redirectTo}
    view="signIn"
  />
