import ProductDto from '@data/ProductDto'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {notFound} from 'next/navigation'
import {ProductPane} from '@feature/admin/product/Pane'
import ProducerDto from '@/data/ProducerDto'

export const getRoute = async ({productId, ...params}) => {
  const product = await ProductDto.get(productId)
  return [
    ...(await getParentRoute(params)),
    {
      name: product?.name,
      segment: productId,
    },
  ]
}

const Page = async ({user, productId}) => {
  const product = await ProductDto.get(productId)
  if (!product) {
    notFound()
  }
  const canEdit = await ProductDto.canEdit(user, productId)
  const producer = await ProducerDto._getRaw(product.producerId)
  return <ProductPane product={product} canEdit={canEdit} producer={producer} />
}

export default makeMain({Page, getRoute})
