import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import UserDto from '@data/UserDto'
import {prisma} from '@/db'

const UserOnVendorDto = {
  async canSee(user, _userId, vendorId) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }

    if (user.vendors.some(edge => edge.vendorId === vendorId && edge.role === 'admin')) {
      return true
    }

    return false
  },

  async canEdit(user, _userId, vendorId) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }

    if (user.vendors.some(edge => edge.vendorId === vendorId && edge.role === 'admin')) {
      return true
    }

    return false
  },

  async canCreate(user, _userId, vendorId) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }

    // No invitation required for now
    if (
      user.vendors.some(edge => edge.vendorId === vendorId && edge.role === 'admin')
    ) {
      return true
    }
    return false
  },

  async _getRaw(userId, vendorId) {
    return await prisma.userOnVendor.findUnique({
      where: {userId, vendorId}
    })
  },

  async findMany(options) {
    const user = await UserDto.getCurrent()
    const rawUserOnVendors = await prisma.userOnVendor.findMany(options)
    return await ArrayUtil.asyncFilter(rawUserOnVendors, edge => UserOnVendorDto.canSee(user, edge.userId, edge.vendorId))
  },

  async get(userId, vendorId) {
    const user = await UserDto.getCurrent()
    if (!await UserOnVendorDto.canSee(user, userId, vendorId)) {
      return null
    }
    return await UserOnVendorDto._getRaw(userId, vendorId)
  },

  async create(edge) {
    const user = await UserDto.getCurrent()
    assert(await UserOnVendorDto.canCreate(user))
    return void await prisma.userOnVendor.createMany({data: [edge]})
  },

  async update(edge) {
    const user = await UserDto.getCurrent()
    assert(await UserOnVendorDto.canEdit(user, edge.userId, edge.vendorId))
    return await prisma.userOnVendor.update({
      where: {userId: edge.userId, vendorId: edge.vendorId},
      data: edge,
    })
  },
}

export default UserOnVendorDto
