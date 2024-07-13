import ProductDto from '@data/ProductDto'
import {Form} from '@feature/admin/product/Form'
import {getRoute as getParentRoute} from '../page'
import {makeMain, UnauthorizedPage} from '@/feature/admin/util/Main'
import {ProductUtil} from '@util/ProductUtil'
import {publish, saveDraft, submitForReview, getFormProps} from '@feature/admin/product/FormAction'
import UserDto from '@/data/UserDto'

export const getRoute = async params => {
  return [
    ...(await getParentRoute(params)),
    {
      name: 'Create',
      segment: 'create',
    },
  ]
}

const Page = async ({user}) => {
  if (!(await ProductDto.canCreate(user))) {
    return <UnauthorizedPage />
  }

  return (
    <Form
      {...await getFormProps(user)}
      publish={publish.bind(null, undefined)}
      saveDraft={saveDraft.bind(null, undefined)}
      submitForReview={submitForReview.bind(null, undefined)}
      product={ProductUtil.read({})}
      user={UserDto.getCurrent()}
    />
  )
}

export default makeMain({Page, getRoute})
