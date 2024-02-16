'use server'
import ImageRefDto from '@data/ImageRefDto'
import ProductDto from '@data/ProductDto'
import testData from '@/test/testData'
import UserDto from '@data/UserDto'
import VendorDto from '@data/VendorDto'
import {prisma} from '@/db'
import {ProductUtil} from '@util/ProductUtil'

export const populate = async () => {
  'use server'
  const data = testData

  await ImageRefDto.create({publicId: ProductUtil.images.sativa})
  await ImageRefDto.create({publicId: ProductUtil.images.indica})

  for (const vendor of data.vendors) {
    const {latLng, ...rest} = vendor
    const vendorId = await VendorDto.createOrUpdate(undefined, {
      ...rest,
      signupStatus: {...rest.signupStatus, complete: true},
    })
    await prisma.$executeRaw`
      update "Vendor" set "latLng"=ST_MakePoint(${latLng[0]}, ${latLng[1]}) where id=${vendorId}
    `
  }

  for (const product of data.products) {
    const vendor = await prisma.vendor.findFirst({where: {name: product.vendorName}})
    product.vendorId = vendor.id
    delete product.vendorName
    await ProductDto.createOrUpdate(undefined, product)
  }
}

export const assignAdmin = async () => {
  const user = await UserDto.getCurrent()
  await prisma.user.update({
    where: {id: user.id},
    data: {
      roles: user.roles.includes('admin') ? user.roles : ['admin', ...user.roles],
    },
  })
}

export const truncateData = async () => {
  'use server'
  await prisma.$executeRaw`truncate table "Product" cascade`
  await prisma.$executeRaw`truncate table "Vendor" cascade`
  await prisma.$executeRaw`truncate table "Producer" cascade`
  await prisma.$executeRaw`truncate table "ImageRef" cascade`
}

export const truncateUser = async () => {
  'use server'
  await prisma.$executeRaw`truncate table "User" cascade`
  await prisma.$executeRaw`truncate table "Session" cascade`
  await prisma.$executeRaw`truncate table "Account" cascade`
}
