import {ResetPassword} from '@components/auth/ResetPassword'

export default async ({searchParams}) =>
  <ResetPassword
    redirectTo={searchParams.redirectTo}
  />
