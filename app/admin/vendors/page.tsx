import VendorDto from '@data/VendorDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {VendorTable} from '@feature/admin/vendor/Table'
import { hasAdminPermission, isProducer, isVendor } from '@/util/Roles'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('vendors'),
]

const Page = async ({user}) => {
  let isAdmin = false;
  let isOwnersAccount = false;
  let vendors
  if (hasAdminPermission(user.roles)) {
    isAdmin = true;
    vendors = await VendorDto.findMany()
  } else if (isVendor(user.roles)) {
    vendors = await VendorDto.findMany({
      where: {
        users: {
          some: {userId: user.id},
        },
      },
    })
    isOwnersAccount = true;
  } else if (isProducer(user.roles)) {
    vendors = await VendorDto.findMany({
    })
  } else {
    vendors = []
  }

  return <VendorTable vendors={vendors} isAdmin={isAdmin}  isOwnerAccount = {isOwnersAccount}/>
}

export default makeMain({Page, getRoute})
