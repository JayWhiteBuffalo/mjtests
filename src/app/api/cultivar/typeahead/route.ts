import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword')

  const products = await prisma.product.findMany({
    select: {cultivar: true},
    where: {
      cultivar: {
        contains: keyword,
        mode: 'insensitive',
      }
    },
    distinct: ['cultivar'],
    orderBy: {cultivar: 'asc'},
  })

  const items = products.map(({cultivar}) => ({name: cultivar, key: cultivar}))

  return Response.json(items)
}
