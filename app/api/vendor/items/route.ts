import VendorDto from '@data/VendorDto'

export async function POST(request: Request) {
  const {keys} = await request.json()

  const vendors = await VendorDto.findMany({
    where: {
      name: {in: keys},
    },
  })

  const items = vendors.map(({name}) => ({name, key: name}))

  return Response.json(items)
}
