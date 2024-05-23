import ProductDto from '@data/ProductDto'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
import {notFound} from 'next/navigation'
import {ProductPane} from '../Pane.tsx'

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
  return <ProductPane product={product} canEdit={canEdit} />
}

export default makeMain({Page, getRoute})
