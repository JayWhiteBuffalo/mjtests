import VendorDto from '@data/VendorDto'
import {Form} from '@feature/admin/vendor/Form'
import {getRoute as getParentRoute} from '../page'
import {makeMain, UnauthorizedPage} from '@/feature/admin/util/Main'
import {save, getFormProps} from '@feature/admin/vendor/FormAction'
import {VendorUtil} from '@util/VendorUtil'

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
  if (!(await VendorDto.canCreate(user))) {
    return <UnauthorizedPage />
  }

  return (
    <Form
      {...await getFormProps(user, undefined)}
      action={save.bind(null, undefined)}
      vendor={VendorUtil.read({})}
    />
  )
}

export default makeMain({Page, getRoute})
