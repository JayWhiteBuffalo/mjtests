import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import supabase from '@api/supabaseServer'
import {prisma} from '@/db'
import { Permission, hasAdminPermission, hasOwnerPermission, hasSalesPermission, hasManagerPermission } from '@/util/Roles'
import {User} from '@nextui-org/react'

const UserDto = {
  async canSee(user, userId) {

    if(hasAdminPermission(user.roles) ||
    hasOwnerPermission(user.roles) ||
    hasSalesPermission(user.roles)){
      return true;
    }
    if (user.id === userId) {
      return true
    }

    const otherUser = await UserDto._getRaw(userId)
    const otherVendorIds = new Set(otherUser.vendors.map(edge => edge.vendorId))
    if (
      user.vendors
        .filter(edge => (edge.role === 'admin' || hasAdminPermission(edge.role)))
        .some(edge => otherVendorIds.has(edge.vendorId))
    ) {
      return true
    }

    return false
  },

  async canCreate(user) {
    if (hasAdminPermission(user.roles) ||
     hasSalesPermission(user.roles) || 
     hasOwnerPermission(user.roles)) {
      return true
    }
    if(user.roles.include('admin'))
    return false
  },

  async canEdit(user, userId) {
    if (hasAdminPermission(user.roles) ||
    hasOwnerPermission(user.roles) 
    ) {
      return true
    }
    if (user.id === userId) {
      return true
    }
    return false
  },

  async canDelete(user){ 
    if (hasAdminPermission(user.roles)){
      return true;
    }
    return false;
  },

  async _getRaw(userId) {
    return await prisma.user.findUnique({
      where: {id: userId},
      include: {
        vendors: true,
        producers: true,
      },
    })
  },

  async getCurrent() {
    const authUser = (await supabase().auth.getUser()).data?.user
    if (authUser) {
      const user = await UserDto._getRaw(authUser.id)
      if (user) {
        user.loggedIn = true
        user.authUser = authUser
        return user
      }
    }
    return {
      loggedIn: false,
      producers: [],
      roles: [],
      vendors: [],
    }
  },

  async get(userId) {
    const currentUser = await UserDto.getCurrent()
    if (!(await UserDto.canSee(currentUser, userId))) {
      return null
    }
    return await UserDto._getRaw(userId)
  },

  async getByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {email},
    })
    return user && UserDto.get(user.id)
  },

  async findMany(options) {
    options ??= {}
    options.orderBy ??= {name: 'asc'}
    const currentUser = await UserDto.getCurrent()
    const rawUsers = await prisma.user.findMany(options)
    return await ArrayUtil.asyncFilter(rawUsers, raw =>
      UserDto.canSee(currentUser, raw.id),
    )
  },

  
    async create(userData, currentUser) {
      assert(await UserDto.canCreate(currentUser), 'Permission denied')
  
      const {
        firstname,
        lastname,
        email,
        password,
        role,
      } = userData
  
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          firstname,
          lastname,
          email,
          password,
          role,
          createdBy: currentUser.id,
        }
      })
  
      console.log(newUser)
      return await newUser;
    },

  async update(userId, user) {
    const currentUser = await UserDto.getCurrent()
    assert(await UserDto.canEdit(currentUser, userId))
    return await prisma.user.update({
      where: {id: userId},
      data: user,
    })
  },

  async delete(userId){
    const currentUser = await UserDto.getCurrent()
    if (!await UserDto.canDelete(currentUser)) {
      throw new Error('Permission denied');
    }
    return await prisma.$transaction(async (prisma) => {
      try{
      // Delete associated UserOnVendor and UserOnProducer records
      await prisma.userOnVendor.deleteMany({ where: { userId } });
      await prisma.userOnProducer.deleteMany({ where: { userId } });
      // Delete associated BusinessRequests Created by User
      await prisma.businessRequest.deleteMany({ where: { createdById: userId } });

      // Do not delete producers, products, vendors, imageRefs since they need to remain
      // even if the user who created/updated them is deleted
      //Must be deleted directly with a seperate action

      // Delete the user
      await prisma.user.delete({ where: { id: userId } });

      console.log(`User with ID ${userId} and associated records successfully deleted.`);
    } catch (error) {
      console.error('Error deleting user and associated records:', error);
      throw new Error('Error deleting user and associated records');
    }
    });
  }
}

export default UserDto
