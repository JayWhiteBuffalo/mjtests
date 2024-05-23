import {Transition} from '@/feature/auth/component/Transition'
import {headers} from 'next/headers'

export default async ({searchParams}) => {
  const referrer = headers().get('Referer')

  return (
    <Transition
      autoReturn={referrer != null}
      method={searchParams.method}
      returnTo={searchParams.returnTo}
    />
  )
}
