import VendorDto from '@data/VendorDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {VendorTable} from '@feature/admin/vendor/Table'
import { hasAdminPermission } from '@/util/Roles'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('vendors'),
]

const Page = async ({user}) => {
  let isAdmin = false;
  let vendors
  if (hasAdminPermission(user.roles)) {
    isAdmin = true;
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

  return <VendorTable vendors={vendors} isAdmin={isAdmin}/>
}

export default makeMain({Page, getRoute})
