import {
  Transition,
  toTransitionMethod,
} from '@/feature/auth/component/Transition'
import {headers} from 'next/headers'

const Page = async ({
  searchParams,
}: {
  searchParams: {
    method?: string
    returnTo?: string
  }
}) => {
  const referrer = headers().get('Referer')

  return (
    <Transition
      autoReturn={referrer != null}
      method={toTransitionMethod(searchParams.method)}
      returnTo={searchParams.returnTo}
    />
  )
}
export default Page
