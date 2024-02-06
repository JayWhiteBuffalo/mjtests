import ArrayUtil from '@util/ArrayUtil'
import {FilterUtil} from '@util/FilterUtil'
import {PrismaClient} from '@prisma/client'
import {ProductUtil} from '@util/ProductUtil'
import {VendorUtil} from '@util/VendorUtil'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const filter = FilterUtil.fromURL(new URL(request.url))

  let products = await prisma.product.findMany({
    ...FilterUtil.toPrisma(filter),
    include: {vendor: true},
  })

  for (const product of products) {
    VendorUtil.populate(product.vendor)
    ProductUtil.populate(product, filter.location.center)
  }

  if (filter.location.distance != null) {
    products = products.filter(product => FilterUtil.testLocationFilter(filter.location, product))
  }

  if (filter.sortBy === 'distance') {
    ArrayUtil.sortInPlaceBy(products, x => [x.distance, x.name])
  }

  return Response.json(products)
}
