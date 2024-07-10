import UserDto from '@data/UserDto'
import UserOnProducerDto from '@data/UserOnProducerDto'
import UserOnVendorDto from '@data/UserOnVendorDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {UserTable} from '@feature/admin/user/Table'
import { Permission, hasAdminPermission, hasOwnerPermission, hasManagerPermission, isProducer, isVendor } from '@/util/Roles'
import {select} from '@nextui-org/react'
import {getUserOnVendor, getUserOnProducer} from '@/feature/admin/user/forms/FormAction'
import {prisma} from '@/db'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('users'),
]

const Page = async ({user}) => {
  const userPermission = user.roles;
  let users;

  if (hasAdminPermission(userPermission)){
    users = await UserDto.findMany()
  } 

  if(isVendor(userPermission) && (hasOwnerPermission(userPermission) || hasManagerPermission(userPermission))){
    const vendorId = await getUserOnVendor(user.id);
    const edges = await prisma.userOnVendor.findMany({
      where: {
        vendorId: vendorId.vendorId,
      },
      select: {
        userId: true,
      },
    })
    // Extract userIds from userOnVendors to query users
    const userIds = edges.map(edge => edge.userId);
    // Fetch users from UserDto where userId is in the array of userIds
    users = await UserDto.findMany({
      where: {
        id: {
          in: userIds,
            },
      },
    });
  }

  if(isProducer(userPermission) && (hasOwnerPermission(userPermission) || hasManagerPermission(userPermission))){
    const producerId = await getUserOnProducer(user.id);
    const edges = await prisma.userOnProducer.findMany({
      where: {
        producerId: producerId.producerId,
      },
      select: {
        userId: true,
      },
    })
    // Extract userIds from userOnVendors to query users
    const userIds = edges.map(edge => edge.userId);
    // Fetch users from UserDto where userId is in the array of userIds
    users = await UserDto.findMany({
      where: {
        id: {
          in: userIds,
            },
      },
    });
  }

  return <UserTable currentUser = {user} users={users} userPermission={userPermission} />
  
}

export default makeMain({Page, getRoute})
