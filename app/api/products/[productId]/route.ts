import ProductDto from '@/data/ProductDto'
import UserDto from '@/data/UserDto'

export const GET = async (request, {params}) => {
  const product = await ProductDto.get(params.productId)
  return Response.json(product, {status: product ? 200 : 404})
}


export const DELETE = async (request, { params }) => {
    const { productId } = params;
    try {
      const user = await UserDto.getCurrent()
      if (!await ProductDto.canDelete(user)) {
        return new Response(JSON.stringify({ message: 'Permission denied' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      await ProductDto.delete(productId)
      return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
    } catch (error) {
      console.error('Error deleting Product:', error)
      return new Response(JSON.stringify({ message: 'Error deleting Product' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }