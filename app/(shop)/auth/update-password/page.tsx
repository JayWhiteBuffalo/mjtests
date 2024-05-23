import {UpdatePassword} from '@/feature/auth/component/UpdatePassword'

export default async ({searchParams}) => (
  <UpdatePassword returnTo={searchParams.returnTo} />
)
