import assert from 'assert'
import ArrayUtil from '@util/ArrayUtil'
import ProducerDto from '@data/ProducerDto'
import VendorDto from '@data/VendorDto'
import UserDto from '@data/UserDto'
import {ProductFilterUtil} from '@/feature/shop/util/ProductFilterUtil'
import {prisma} from '@/db'
import {ProductUtil} from '@util/ProductUtil'
import {VendorUtil} from '@util/VendorUtil'
import {nanoid} from 'nanoid'

const ProductDto = {
  async canSee(user, productId) {
    if (user.roles.includes('admin')) {
      return true
    }
    const product = await ProductDto._getRaw(productId)
    if (user.vendors.some(edge => edge.vendorId === product.vendorId)) {
      return true
    }
    if (!product.isDraft) {
      return true
    }
    return false
  },

  async canEdit(user, productId) {
    if (user.roles.includes('admin')) {
      return true
    }
    const product = await ProductDto._getRaw(productId)
    if (!product) {
      return false
    }
    if (await VendorDto.canEdit(user, product.vendorId)) {
      return true
    }
    return false
  },

  async canCreate(user) {
    if (user.roles.includes('admin')) {
      return true
    }
    return false
  },

  async _getRaw(productId) {
    return await prisma.product.findUnique({
      where: {id: productId},
      include: {},
    })
  },

  async getProducts(filter) {
    filter ??= ProductFilterUtil.defaultFilter()
    let products = await ProductDto.findMany({
      ...ProductFilterUtil.toPrisma(filter),
      include: {vendor: true, imageRefs: true},
    })

    for (const product of products) {
      VendorUtil.populate(product.vendor)
      VendorUtil.populateDistance(product.vendor, filter.location.center)
      ProductUtil.populateFlags(product)
    }

    if (filter.flags.openNow) {
      products = products.filter(product => product.flags.openNow)
    }

    if (filter.location.distance != null) {
      products = products.filter(product =>
        ProductFilterUtil.testLocationFilter(filter.location, product),
      )
    }

    if (filter.sortBy === 'distance') {
      ArrayUtil.sortInPlaceBy(products, x => [
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

  async findMany(options) {
    options ??= {}
    options.orderBy ??= {name: 'asc'}
    const user = await UserDto.getCurrent()
    const rawProducts = await prisma.product.findMany(options)
    return await ArrayUtil.asyncFilter(rawProducts, raw =>
      ProductDto.canSee(user, raw.id),
    )
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
        where: {id: productId},
        data: {
          ...product,
          updatedById: user.id,
          version: {increment: 1},
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
}

export default ProductDto
