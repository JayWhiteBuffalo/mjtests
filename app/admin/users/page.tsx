import UserDto from '@data/UserDto'
import UserOnProducerDto from '@data/UserOnProducerDto'
import UserOnVendorDto from '@data/UserOnVendorDto'
import {getRootPageRouteItem} from '@app/admin/RootPage'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
import {UserTable} from './Table'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('users'),
]

const Page = async ({user}) => {
  let users
  if (user.roles.includes('admin')) {
    users = await UserDto.findMany()
  } else if (user.roles.includes('vendor')) {
    const edges = await UserOnVendorDto.findMany({
      select: {vendorId: true},
      where: {
        userId: user.id,
        role: 'admin',
      },
    })
    users = await UserDto.findMany({
      where: {
        vendors: {
          some: {
            vendorId: {in: edges.map(edge => edge.vendorId)},
          },
        },
      },
    })
  } else if (user.roles.includes('producer')) {
    const edges = await UserOnProducerDto.findMany({
      select: {producerId: true},
      where: {
        userId: user.id,
        role: 'admin',
      },
    })
    users = await UserDto.findMany({
      where: {
        producers: {
          some: {
            producerId: {in: edges.map(edge => edge.producerId)},
          },
        },
      },
    })
  } else {
    users = []
  }

  return <UserTable users={users} />
}

export default makeMain({Page, getRoute})
