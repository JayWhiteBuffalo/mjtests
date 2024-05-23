import BusinessRequestDto from '@data/BusinessRequestDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage.js'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@/feature/admin/util/Main.jsx'
import {RequestTable} from '@feature/admin/request/Table.jsx'

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
