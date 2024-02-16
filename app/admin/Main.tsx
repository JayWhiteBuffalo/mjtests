import UserDto from '@data/UserDto'
import {Breadcrumb} from '@app/admin/components/Breadcrumb'
import {canUseRootPage, canUseAdmin} from './RootPage'
import {getPathname} from 'next-impl-getters/get-pathname'
import {redirect} from 'next/navigation'
import {signIn} from '@/auth'

export const makeMain = ({getRoute, Page}) => async ({params}) => {
  const user = await UserDto.getCurrent()
  if (!user.loggedIn) {
    return signIn(null, {redirectTo: getPathname()})
  }
  if (!canUseAdmin(user)) {
    redirect('/business')
  }
  const route = await getRoute(params)
  const rootPageKey = route[1].segment
  if (!canUseRootPage(user, rootPageKey)) {
    return <UnauthorizedPage />
  }
  return (
    <>
      <Breadcrumb items={route} />
      <Page {...params} user={user} />
    </>
  )
}

export const UnauthorizedPage = () =>
  <div className="UnauthorizedPage">This feature is currently unavailable.</div>
