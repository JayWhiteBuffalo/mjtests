import ProductDto from '@data/ProductDto'
import {Form} from '../../Form'
import {publish, saveDraft, getFormProps} from '../../FormAction'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain, UnauthorizedPage} from '@app/admin/Main'
import {notFound} from 'next/navigation'

export const getRoute = async params =>
  [...(await getParentRoute(params)), {
    name: 'Edit',
    segment: 'edit',
  }]

const Page = async ({user, productId}) => {
  const product = await ProductDto.get(productId)
  if (!product) {
    notFound()
  }
  if (!await ProductDto.canEdit(user, productId)) {
    return <UnauthorizedPage />
  }

  return (
    <Form
      {...await getFormProps(user)}
      product={product}
      publish={publish.bind(null, productId)}
      saveDraft={saveDraft.bind(null, productId)}
      />
  )
}

export default makeMain({Page, getRoute})

