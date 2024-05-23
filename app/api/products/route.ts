import ProductDto from '@data/ProductDto'
import {ProductFilterUtil} from '@/feature/shop/util/ProductFilterUtil'

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const query = Object.fromEntries(searchParams)
  const filter = ProductFilterUtil.fromQuery(query)
  const products = await ProductDto.getProducts(filter)

  return Response.json(products)
}
