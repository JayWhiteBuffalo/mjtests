import {UpdatePassword} from '@components/auth/UpdatePassword'

export default async ({searchParams}) => (
  <UpdatePassword returnTo={searchParams.returnTo} />
)
