import ProducerDto from '@data/ProducerDto'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword')

  const producer = await ProducerDto.findMany({
    where: {
      name: {
        contains: keyword,
        mode: 'insensitive',
      },
    },
    distinct: ['name'],
    orderBy: {name: 'asc'},
  })

  const items = producer.map(({name}) => ({name, key: name}))

  return Response.json(items)
}
