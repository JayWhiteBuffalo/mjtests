import {EmailAuth} from '@/feature/auth/component/EmailAuth'

export default async ({searchParams}) => (
  <EmailAuth returnTo={searchParams.returnTo} view="signUp" />
)
