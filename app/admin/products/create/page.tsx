import ProductDto from '@data/ProductDto'
import {Form} from '../Form'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain, UnauthorizedPage} from '@app/admin/Main'
import {ProductUtil} from '@util/ProductUtil'
import {publish, saveDraft, getFormProps} from '../FormAction'

export const getRoute = async (params) => {
  return [...(await getParentRoute(params)), {
    name: 'Create',
    segment: 'create',
  }]
}

const Page = async ({user}) => {
  if (!await ProductDto.canCreate(user)) {
    return <UnauthorizedPage />
  }

  return (
    <Form
      {...await getFormProps(user)}
      publish={publish.bind(null, undefined)}
      saveDraft={saveDraft.bind(null, undefined)}
      product={ProductUtil.read({})}
      />
  )
}

export default makeMain({Page, getRoute})
