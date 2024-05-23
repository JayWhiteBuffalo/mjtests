import {EmailAuth} from '@/feature/auth/component/EmailAuth'

export type PageProps = {
  searchParams: {
    returnTo: string
  }
}

const Page = async ({searchParams}: PageProps) => (
  <EmailAuth returnTo={searchParams.returnTo} view="signIn" />
)

export default Page
