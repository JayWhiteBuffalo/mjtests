import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import UserDto from '@data/UserDto'
import {prisma} from '@/db'
import {VendorUtil} from '@util/VendorUtil'
import {nanoid} from 'nanoid'

const VendorDto = {
  async canSee(user, vendorId) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    const vendor = await VendorDto._getRaw(vendorId)
    if (vendor.signupStatus.complete) {
      return true
    }

    return false
  },

  async canEdit(user, vendorId) {
    if (user.roles.includes('admin')) {
      return true
    }
    const vendor = await VendorDto._getRaw(vendorId)
    if (!vendor) {
      return false
    }
    if (user.vendors.some(edge => edge.vendorId === vendor.id)) {
      return true
    } else {
      return false
    }
  },

  async canCreate(user) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    return false
  },

  async _getRaw(vendorId) {
    return await prisma.vendor.findUnique({
      where: {id: vendorId}
    })
  },

  async findMany(options) {
    const user = await UserDto.getCurrent()
    const rawVendors = await prisma.vendor.findMany(options)
    const vendors = await ArrayUtil.asyncFilter(rawVendors, raw => VendorDto.canSee(user, raw.id))
    return vendors.map(VendorUtil.populate)
  },

  async get(vendorId) {
    const user = await UserDto.getCurrent()
    if (!await VendorDto.canSee(user, vendorId)) {
      return null
    }
    const vendor = await VendorDto._getRaw(vendorId)
    return vendor && VendorUtil.populate(vendor)
  },

  async createOrUpdate(vendorId, vendor) {
    const user = await UserDto.getCurrent()

    if (vendorId) {
      assert(await VendorDto.canEdit(user, vendorId))
      if (vendor.location) {
        vendor.location._latLng ??= vendor.latLng
        vendor.latLng ??= vendor.location._latLng
      }
      await prisma.vendor.update({
        where: {id: vendorId},
        data: {
          ...vendor,
          updatedById: user.id,
          version: {increment: 1},
        },
      })
      return vendorId

    } else {
      assert(await VendorDto.canCreate(user))
      const id = nanoid()
      await prisma.vendor.createMany({
        data: [{
          ...vendor,
          id,
          createdById: user.id,
          updatedById: user.id,
        }],
      })
      return id
    }
  },
}

export default VendorDto
