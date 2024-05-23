import {UpdatePassword} from '@/feature/auth/component/UpdatePassword'

const Page = async ({
  searchParams,
}: {
  searchParams: {
    returnTo?: string
  }
}) => <UpdatePassword returnTo={searchParams.returnTo} />
export default Page
