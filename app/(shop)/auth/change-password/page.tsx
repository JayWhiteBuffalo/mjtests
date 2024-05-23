import {ResetPassword} from '@/feature/auth/component/ResetPassword'

const Page = async ({searchParams}: {searchParams: {returnTo?: string}}) => (
  <ResetPassword returnTo={searchParams.returnTo} />
)
export default Page
