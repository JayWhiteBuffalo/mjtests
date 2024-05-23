import ProducerDto from '@data/ProducerDto'
import {Form} from '@feature/admin/producer/Form'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain, UnauthorizedPage} from '@/feature/admin/util/Main'
import {notFound} from 'next/navigation'
import {save, getFormProps} from '@feature/admin/producer/FormAction'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  {
    name: 'Edit',
    segment: 'edit',
  },
]

const Page = async ({user, producerId}) => {
  const producer = await ProducerDto.get(producerId)
  if (!producer) {
    notFound()
  }
  if (!(await ProducerDto.canEdit(user, producerId))) {
    return <UnauthorizedPage />
  }
  return (
    <Form
      {...await getFormProps(user, producerId)}
      action={save.bind(null, producerId)}
      producer={producer}
    />
  )
}

export default makeMain({Page, getRoute})
