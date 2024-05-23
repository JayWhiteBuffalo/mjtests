import ProductDto from '@data/ProductDto'
import {Form} from '@feature/admin/product/Form'
import {publish, saveDraft, getFormProps} from '@feature/admin/product/FormAction'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain, UnauthorizedPage} from '@/feature/admin/util/Main'
import {notFound} from 'next/navigation'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  {
    name: 'Edit',
    segment: 'edit',
  },
]

const Page = async ({user, productId}) => {
  const product = await ProductDto.get(productId)
  if (!product) {
    notFound()
  }
  if (!(await ProductDto.canEdit(user, productId))) {
    return <UnauthorizedPage />
  }

  return (
    <Form
      {...await getFormProps(user, productId)}
      product={product}
      publish={publish.bind(null, productId)}
      saveDraft={saveDraft.bind(null, productId)}
    />
  )
}

export default makeMain({Page, getRoute})
