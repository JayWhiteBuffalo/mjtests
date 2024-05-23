import {ResetPassword} from '@/feature/auth/component/ResetPassword'

export default async ({searchParams}) => (
  <ResetPassword returnTo={searchParams.returnTo} />
)
