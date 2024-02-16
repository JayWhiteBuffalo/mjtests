import VendorDto from '@data/VendorDto'
import {Form} from '../Form'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain, UnauthorizedPage} from '@app/admin/Main'
import {save, getFormProps} from '../FormAction'
import {VendorUtil} from '@util/VendorUtil'

export const getRoute = async (params) => {
  return [...(await getParentRoute(params)), {
    name: 'Create',
    segment: 'create',
  }]
}

const Page = async ({user}) => {
  if (!await VendorDto.canCreate(user)) {
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
