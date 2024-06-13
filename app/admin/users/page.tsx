import UserDto from '@data/UserDto'
import UserOnProducerDto from '@data/UserOnProducerDto'
import UserOnVendorDto from '@data/UserOnVendorDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {UserTable} from '@feature/admin/user/Table'
import { Permission, hasAdminPermission, hasOwnerPermission, hasManagerPermission, isProducer, isVendor } from '@/util/Roles'
import {select} from '@nextui-org/react'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('users'),
]

const Page = async ({user}) => {
  let userPermission = user.roles;
  let users;
  console.log(typeof user.roles); // Should be 'object' (array)

  console.log(userPermission)

  if (hasAdminPermission(userPermission)){
    users = await UserDto.findMany()
  } 

  if(isVendor(userPermission) && (hasOwnerPermission(userPermission) || hasManagerPermission(userPermission))){
    const edges = await UserOnVendorDto.findMany({
      select: {vendorId: true},
      where: {
        userId: user.id,
        role: 'admin'
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
  }

  if(isProducer(userPermission) && (hasOwnerPermission(userPermission) || hasManagerPermission(userPermission))){
    const edges = await UserOnProducerDto.findMany({
      select: {producerId: true},
      where: {
        userId: user.id,
        role: 'admin'
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
  }

  return <UserTable users={users} />
  
}

export default makeMain({Page, getRoute})
