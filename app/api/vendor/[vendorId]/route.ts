import VendorDto from '@data/VendorDto'

export const GET = async (request, {params}) => {
  const vendor = await VendorDto.get(params.vendorId)
  return Response.json(vendor, {status: vendor ? 200 : 404})
}
