import VendorDto from '@data/VendorDto'
import UserDto from '@/data/UserDto'

export const GET = async (request, {params}) => {
  const vendor = await VendorDto.get(params.vendorId)
  return Response.json(vendor, {status: vendor ? 200 : 404})
}

export const DELETE = async (request, { params }) => {
  const { vendorId } = params;
  try {
    const user = await UserDto.getCurrent()
    if (!await VendorDto.canDelete(user)) {
      return new Response(JSON.stringify({ message: 'Permission denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    await VendorDto.delete(vendorId)
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return new Response(JSON.stringify({ message: 'Error deleting vendor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

