import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import ProductDto from '@data/ProductDto'
import UserDto from '@data/UserDto'
import VendorDto from '@data/VendorDto'
import {prisma} from '@/db'

const ImageRefDto = {
  async canSee(user, publicId) {
    if (user.roles.includes('admin')) {
      return true
    }
    const imageRef = await ImageRefDto._getRaw(publicId)
    if (imageRef.uploadedById === user.id) {
      return true
    }
    if (imageRef.vendorId && await VendorDto.canSee(user, imageRef.vendorId)) {
      return true
    }
    if (imageRef.productId && await ProductDto.canSee(user, imageRef.productId)) {
      return true
    }
    return false
  },

  async canEdit(user, publicId) {
    if (user.roles.includes('admin')) {
      return true
    }
    const imageRef = await ImageRefDto._getRaw(publicId)
    if (imageRef.vendorId && await VendorDto.canEdit(user, imageRef.vendorId)) {
      return true
    }
    if (imageRef.productId && await ProductDto.canEdit(user, imageRef.productId)) {
      return true
    }
    return false
  },

  async canCreate(user) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    if (user.roles.includes('vendor')) {
      return true
    }
    if (user.roles.includes('producer')) {
      return true
    }
    return false
  },

  async _getRaw(publicId) {
    return await prisma.imageRef.findUnique({
      where: {publicId},
    })
  },

  async get(publicId) {
    const user = await UserDto.getCurrent()
    if (!await ImageRefDto.canSee(user, publicId)) {
      return null
    }
    return await ImageRefDto._getRaw(publicId)
  },

  async findMany(options) {
    options ??= {}
    options.orderBy ??= {lastModified: 'dasc'}
    const user = await UserDto.getCurrent()
    const rawImageRefs = await prisma.imageRef.findMany(options)
    return await ArrayUtil.asyncFilter(rawImageRefs, raw => ImageRefDto.canSee(user, raw.id))
  },

  async create(imageRef) {
    const user = await UserDto.getCurrent()
    assert(await ImageRefDto.canCreate(user))
    assert(!imageRef.vendorId || await VendorDto.canEdit(user, imageRef.vendorId))
    assert(!imageRef.productId || await ProductDto.canEdit(user, imageRef.productId))
    return await prisma.imageRef.create({data: imageRef})
  },

  async update(publicId, imageRef) {
    const user = await UserDto.getCurrent()
    assert(await ImageRefDto.canEdit(user, publicId))
    assert(!imageRef.vendorId || await VendorDto.canEdit(user, imageRef.vendorId))
    assert(!imageRef.productId || await ProductDto.canEdit(user, imageRef.productId))
    assert(imageRef.uploadedById === user.id)
    return await prisma.imageRef.update({
      where: {publicId},
      data: imageRef,
    })
  },

  async delete(publicId) {
    const user = await UserDto.getCurrent()
    assert(await ImageRefDto.canEdit(user, publicId))
    return await prisma.imageRef.delete({where: {publicId}})
  },
}

export default ImageRefDto
