import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import UserDto from '@data/UserDto'
import {prisma} from '@/db'
import {VendorUtil} from '@util/VendorUtil'
import {nanoid} from 'nanoid'
import { Permission, hasAdminPermission, hasOwnerPermission, hasSalesPermission } from '@/util/Roles'

const VendorDto = {
  async canSee(user, vendorId) {
    if (hasAdminPermission(user.roles) ||
        hasOwnerPermission(user.roles) ||
        hasSalesPermission(user.roles)
    ) {
      return true
    }

    const vendor = await VendorDto._getRaw(vendorId)
    if (vendor.signupStatus.complete) {
      return true
    }

    return false
  },

  async canEdit(user, vendorId) {
    if (hasAdminPermission(user.roles) ||
        hasOwnerPermission(user.roles)
    ) {
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
    if (hasAdminPermission(user.roles) ||
    hasOwnerPermission(user.roles) ||
    hasSalesPermission(user.roles)) {
      return true
    }
    return false
  },

  async canDelete(user) { 
    if (hasAdminPermission(user.roles)){
      return true;
    }
    return false;
  },

  async _getRaw(vendorId) {
    return await prisma.vendor.findUnique({
      where: {id: vendorId},
    })
  },

  async findMany(options) {
    options ??= {}
    options.orderBy ??= {name: 'asc'}
    const user = await UserDto.getCurrent()
    const rawVendors = await prisma.vendor.findMany(options)
    const vendors = await ArrayUtil.asyncFilter(rawVendors, raw =>
      VendorDto.canSee(user, raw.id),
    )
    return vendors.map(VendorUtil.populate)
  },

  async get(vendorId) {
    const user = await UserDto.getCurrent()
    if (!(await VendorDto.canSee(user, vendorId))) {
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
        data: [
          {
            ...vendor,
            id,
            createdById: user.id,
            updatedById: user.id,
            slug: id,
          },
        ],
      })
      return id
    }
  },

  
  async delete(vendorId){

    //Checks to see if Current User has permission to delete
    const user = await UserDto.getCurrent()
    if (!await VendorDto.canDelete(user)) {
      throw new Error('Permission denied');
    }
    //Checks to see if vendor exists
    const currentVendor = await VendorDto._getRaw(vendorId)
    if (!currentVendor) {
      throw new Error('Vendor not found')
    }

    return await prisma.$transaction(async (prisma) => {
      try{
      // Delete associated UserOnVendor and UserOnProducer records
      await prisma.userOnVendor.deleteMany({ where: { vendorId } });
      await prisma.vendor.delete({ where: { id: vendorId } }) 
      
      console.log(`Vendor with ID ${vendorId} successfully deleted.`);
    } catch (error) {
      console.error('Error deleting vendor and associated records:', error);
      throw new Error('Error deleting vendor and associated records');
    }
    });
  }

}



export default VendorDto
