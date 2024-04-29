import UserDto from '@data/UserDto'
import {Breadcrumb} from '@app/admin/components/Breadcrumb'
import {canUseRootPage, canUseAdmin} from './RootPage'
import {redirect} from 'next/navigation'

export const makeMain = ({getRoute, Page}) => {
  const Main = async ({params}) => {
    const user = await UserDto.getCurrent()
    if (!canUseAdmin(user)) {
      redirect('/business')
    }

    const route = await getRoute(params)
    const rootPageKey = route[1]?.segment
    if (rootPageKey && !canUseRootPage(user, rootPageKey)) {
      return <UnauthorizedPage />
    }

    return (
      <main
        className="mb-[30vh]"
        style={{gridArea: 'main'}}>
        <Breadcrumb items={route} />
        <Page {...params} user={user} />
      </main>
    )
  }
  Main.displayName = 'Main'
  return Main
}

export const UnauthorizedPage = () =>
  <div className="text-gray-800">This feature is currently unavailable.</div>
