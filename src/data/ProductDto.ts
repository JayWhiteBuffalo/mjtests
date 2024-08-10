import assert from 'assert'
import ArrayUtil from '@util/ArrayUtil'
import ProducerDto from '@data/ProducerDto'
import VendorDto from '@data/VendorDto'
import UserDto from '@data/UserDto'
import { ProductFilterUtil } from '@/feature/shop/util/ProductFilterUtil'
import { prisma } from '@/db'
import { ProductUtil } from '@util/ProductUtil'
import { VendorUtil } from '@util/VendorUtil'
import { nanoid } from 'nanoid'
import { custom } from 'zod'
import {
  hasAdminPermission,
  hasSalesPermission,
  hasManagerPermission,
  hasOwnerPermission,
  isVendor,
  isProducer,
  hasEmployeePermission,
} from '@/util/Roles'
import { ProducerUtil } from '@/util/ProducerUtil'

const ProductDto = {
  async canSee(user, productId) {
    if (
      hasAdminPermission(user.roles) ||
      hasSalesPermission(user.roles) ||
      isVendor(user.roles) ||
      isProducer(user.roles)
    ) {
      return true
    }
    const product = await ProductDto._getRaw(productId)
    if (user.vendors.some((edge) => edge.vendorId === product.vendorId)) {
      return true
    }
    if (!product.isDraft) {
      return true
    }
    return false
  },

  async canEdit(user, productId) {
    if (
      hasAdminPermission(user.roles) ||
      hasSalesPermission(user.roles) ||
      hasOwnerPermission(user.roles) ||
      hasManagerPermission(user.roles)
    ) {
      return true
    }
    const product = await ProductDto._getRaw(productId)
    if (!product) {
      return false
    }
    if (
      product.vendorId != null &&
      (await VendorDto.canEdit(user, product.vendorId))
    ) {
      return true
    }
    return false
  },

  async canUseEdit(user) {
    if (
      hasAdminPermission(user.roles) ||
      hasSalesPermission(user.roles) ||
      hasOwnerPermission(user.roles) ||
      hasManagerPermission(user.roles)
    ) {
      return true
    }
    return false
  },

  async canCreate(user) {
    if (
      hasAdminPermission(user.roles) ||
      hasSalesPermission(user.roles) ||
      isVendor(user.roles) ||
      isProducer(user.roles)
    ) {
      return true
    }
    return false
  },

  async canDelete(user) {
    if (hasAdminPermission(user.roles)) {
      return true
    }
    if (
      hasOwnerPermission(user.roles || hasManagerPermission(user.roles))
    ) {
      return true
    }
    return false
  },

  async _getRaw(productId) {
    return await prisma.product.findUnique({
      where: { id: productId },
      include: {},
    })
  },

  async getProducerProducts(filter) {
    filter ??= ProductFilterUtil.defaultFilter()
    filter.producerId = { not: null }

    let products = await ProductDto.findMany({
      ...ProductFilterUtil.toPrisma(filter),
      where: { producerId: { not: null } },
      include: { vendor: true, producer: true, imageRefs: true },
    })

    for (const product of products) {
      ProducerUtil.populate(product.producer)
      ProducerUtil.populateDistance(product.producer, filter.location.center)
      ProductUtil.populateFlags(product)
    }

    if (filter.flags.openNow) {
      products = products.filter((product) => product.flags.openNow)
    }

    if (filter.location.distance != null) {
      products = products.filter((product) =>
        ProductFilterUtil.testLocationFilter(filter.location, product),
      )
    }

    if (filter.sortBy === 'distance') {
      ArrayUtil.sortInPlaceBy(products, (x) => [
        x.producer.distance ?? Infinity,
        x.name,
      ])
    }

    return products
  },

  async getProducts(filter) {
    filter ??= ProductFilterUtil.defaultFilter()
    let products = await ProductDto.findMany({
      ...ProductFilterUtil.toPrisma(filter),
      include: { vendor: true, imageRefs: true },
    })

    for (const product of products) {
      VendorUtil.populate(product.vendor)
      VendorUtil.populateDistance(product.vendor, filter.location.center)
      ProductUtil.populateFlags(product)
    }

    if (filter.flags.openNow) {
      products = products.filter((product) => product.flags.openNow)
    }

    if (filter.location.distance != null) {
      products = products.filter((product) =>
        ProductFilterUtil.testLocationFilter(filter.location, product),
      )
    }

    if (filter.sortBy === 'distance') {
      ArrayUtil.sortInPlaceBy(products, (x) => [
        x.vendor.distance ?? Infinity,
        x.name,
      ])
    }

    return products
  },

  async get(productId) {
    const user = await UserDto.getCurrent()
    if (!(await ProductDto.canSee(user, productId))) {
      return null
    }
    return await ProductDto._getRaw(productId)
  },

  async getUserByProductId(productId) {
    const product = await ProducerDto.get(productId)
    const user = await prisma.user.findUnique({
      where: { id: product.createdById },
      include: {
        roles: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }
    return { user }
  },

  async findMany(options = {}) {
    let extraOrderBy
    if (options.orderBy?.normalizedTerps) {
      options = { ...options }
      extraOrderBy = options.orderBy
      delete options.orderBy
    }
    options.orderBy ??= { name: 'asc' }
    const user = await UserDto.getCurrent()
    const rawProducts = await prisma.product.findMany(options)
    const products = await ArrayUtil.asyncFilter(rawProducts, (raw) =>
      ProductDto.canSee(user, raw.id),
    )
    return ProductFilterUtil.applyTerpeneSort(products, extraOrderBy)
  },

  async createOrUpdate(productId, product) {
    const user = await UserDto.getCurrent()
    assert(
      productId
        ? await ProductDto.canEdit(user, productId)
        : await ProductDto.canCreate(user),
    )
    assert(
      !product.vendorId || (await ProductDto.canEdit(user, product.vendorId)),
    )
    assert(
      !product.producerId ||
        (await ProducerDto.canEdit(user, product.producerId)),
    )
    ProductUtil.addIndexes(product)

    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          ...product,
          updatedById: user.id,
          version: { increment: 1 },
        },
      })
      return productId
    } else {
      const id = nanoid()
      await prisma.product.createMany({
        data: [
          {
            ...product,
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

  async delete(productId) {
    const user = await UserDto.getCurrent()
    if (!(await ProductDto.canDelete(user))) {
      throw new Error('Permission denied')
    }
    const currentProduct = await ProductDto._getRaw(productId)
    if (!currentProduct) {
      throw new Error('Product not found')
    }

    return await prisma.$transaction(async (prisma) => {
      try {
        await prisma.product.delete({ where: { id: productId } })

        console.log(`Product with ID ${productId} successfully deleted.`)
      } catch (error) {
        console.error('Error deleting Product and associated records:', error)
        throw new Error('Error deleting Product and associated records')
      }
    })
  },

  async getDraftsCreatedByEmployees(userId) {
    const userWithAssociations = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userOnVendor: true,
        userOnProducer: true,
      },
    })

    if (!userWithAssociations) {
      throw new Error('User not found')
    }

    const vendorIds = userWithAssociations.userOnVendor.map(
      (assoc) => assoc.vendorId,
    )
    const producerIds = userWithAssociations.userOnProducer.map(
      (assoc) => assoc.producerId,
    )

    const draftProducts = await prisma.product.findMany({
      where: {
        isDraft: true,
        OR: [
          { vendorId: { in: vendorIds } },
          { producerId: { in: producerIds } },
        ],
        createdBy: {
          roles: {
            some: {
              id: { in: ['employeeRoleId1', 'employeeRoleId2'] },
            },
          },
        },
      },
      include: {
        createdBy: true,
      },
    })

    return draftProducts
  },

  async getProductsByVendorId(vendor) {
    console.log(vendor)
    const products = await ProductDto.findMany({
      where: { vendorId: vendor.id },
    })
    return products
  },
}

export default ProductDto
