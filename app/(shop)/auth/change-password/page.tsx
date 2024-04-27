import {ResetPassword} from '@components/auth/ResetPassword'

export default async ({searchParams}) =>
  <ResetPassword
    returnTo={searchParams.returnTo}
  />
