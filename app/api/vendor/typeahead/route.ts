import VendorDto from '@data/VendorDto'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword')

  const vendors = await VendorDto.findMany({
    where: {
      name: {
        contains: keyword,
        mode: 'insensitive',
      }
    },
    distinct: ['name'],
    orderBy: {name: 'asc'},
  })

  const items = vendors.map(({name}) => ({name, key: name}))

  return Response.json(items)
}
