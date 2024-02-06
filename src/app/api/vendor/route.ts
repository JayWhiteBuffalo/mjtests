import {PrismaClient} from '@prisma/client'
import {VendorUtil} from '@util/VendorUtil'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const url = new URL(request.url)
  const name = url.searchParams.get('name')
  const vendor = await prisma.vendor.findUnique({
    where: {name},
  })
  VendorUtil.populate(vendor)

  return Response.json(vendor)
}
