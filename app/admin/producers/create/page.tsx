import ProducerDto from '@data/ProducerDto'
import {Form} from '@feature/admin/producer/Form'
import {getRoute as getParentRoute} from '../page'
import {makeMain, UnauthorizedPage} from '@/feature/admin/util/Main'
import {ProducerUtil} from '@util/ProducerUtil'
import {save, getFormProps} from '@feature/admin/producer/FormAction'

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
  if (!(await ProducerDto.canCreate(user))) {
    return <UnauthorizedPage />
  }

  return (
    <Form
      {...await getFormProps(user, undefined)}
      action={save.bind(null, undefined)}
      producer={ProducerUtil.empty()}
    />
  )
}

export default makeMain({Page, getRoute})
