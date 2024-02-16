import BusinessRequestDto from '@data/BusinessRequestDto'
import {getRootPageRouteItem} from '@app/admin/RootPage'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
import {RequestTable} from './Table'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('requests'),
]

const Page = async ({user}) => {
  let requests
  if (user.roles.includes('admin') || user.roles.includes('sales')) {
    requests = await BusinessRequestDto.findMany({
      where: {archived: false},
    })
  } else {
    requests = []
  }

  return <RequestTable requests={requests} />
}

export default makeMain({Page, getRoute})
