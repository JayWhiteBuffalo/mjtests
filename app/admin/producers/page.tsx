import ProducerDto from '@data/ProducerDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {ProducerTable} from '@feature/admin/producer/Table'
import {hasAdminPermission, isProducer, isVendor} from '@/util/Roles'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('producers'),
]

const Page = async ({user}) => {
  let producers
  let isAdmin = false;
  let isOwnerAccount = false
  if (hasAdminPermission(user.roles)) {
    isAdmin = true;
    producers = await ProducerDto.findMany()
  } else if (isProducer(user.roles)) {
    producers = await ProducerDto.findMany({
      where: {
        users: {
          some: {userId: user.id},
        },
      },
      orderBy: {name: 'asc'},
    })
    isOwnerAccount = true;
  } else if(isVendor){
    producers = await ProducerDto.findMany()

  } else {
    producers = []
  }

  return <ProducerTable producers={producers} isAdmin={isAdmin} isOwnerAccount={isOwnerAccount} />
}

export default makeMain({Page, getRoute})
