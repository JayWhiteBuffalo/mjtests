import testData from './testData'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function populate(data) {
  for (const vendor of data.vendors) {
    const {latLng, ...rest} = vendor
    await prisma.vendor.create({data: rest})
    await prisma.$executeRaw`
      update "Vendor" set "latLng"=ST_MakePoint(${latLng[0]}, ${latLng[1]}) where name=${vendor.name}
    `
  }

  await prisma.product.createMany({data: data.products})
}

async function truncate() {
  await prisma.$executeRaw`truncate table "Product"`
  await prisma.$executeRaw`truncate table "Vendor" cascade`
}

await truncate()
await populate(testData)

