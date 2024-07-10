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
  let producer;
  
  const canEdit = await ProductDto.canEdit(user, productId)

  const product = await ProductDto.get(productId)
  if (!product) {
    notFound()
  }
  
  if(product. producerId){
    producer = await ProducerDto._getRaw(product.producerId)
   } else {
     producer = null
   }

  return <ProductPane product={product} canEdit={canEdit} producer={producer} />
}

export default makeMain({Page, getRoute})
