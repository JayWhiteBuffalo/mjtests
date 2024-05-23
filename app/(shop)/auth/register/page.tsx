import {EmailAuth} from '@/feature/auth/component/EmailAuth'

const Page = async ({
  searchParams,
}: {
  searchParams: {
    returnTo?: string
  }
}) => <EmailAuth returnTo={searchParams.returnTo} view="signUp" />
export default Page
