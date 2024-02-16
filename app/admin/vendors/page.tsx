import VendorDto from '@data/VendorDto'
import {getRootPageRouteItem} from '@app/admin/RootPage'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
import {VendorTable} from './Table'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('vendors'),
]

const Page = async ({user}) => {
  let vendors
  if (user.roles.includes('admin')) {
    vendors = await VendorDto.findMany()
  } else if (user.roles.includes('vendor')) {
    vendors = await VendorDto.findMany({
      where: {
        users: {
          some: {userId: user.id},
        },
      },
    })
  } else {
    vendors = []
  }

  return <VendorTable vendors={vendors} />
}

export default makeMain({Page, getRoute})
