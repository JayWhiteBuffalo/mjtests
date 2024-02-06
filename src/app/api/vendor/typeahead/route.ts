import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword')

  const products = await prisma.product.findMany({
    select: {vendorName: true},
    where: {
      vendorName: {
        contains: keyword,
        mode: 'insensitive',
      }
    },
    distinct: ['vendorName'],
    orderBy: {vendorName: 'asc'},
  })

  const items = products.map(({vendorName}) => ({name: vendorName, key: vendorName}))

  return Response.json(items)
}
