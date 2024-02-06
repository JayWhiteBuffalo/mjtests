import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword')

  const products = await prisma.product.findMany({
    select: {brand: true},
    where: {
      brand: {
        contains: keyword,
        mode: 'insensitive',
      }
    },
    distinct: ['brand'],
    orderBy: {brand: 'asc'},
  })

  const items = products.map(({brand}) => ({name: brand, key: brand}))

  return Response.json(items)
}
