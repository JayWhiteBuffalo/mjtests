import ProducerDto from '@data/ProducerDto'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@/feature/admin/util/Main.jsx'
import {ProducerPane} from '@feature/admin/producer/Pane.jsx'

export const getRoute = async ({producerId, ...params}) => {
  const producer = await ProducerDto.get(producerId)
  return [
    ...(await getParentRoute(params)),
    {
      name: producer?.name,
      segment: producerId,
    },
  ]
}

const Page = async ({user, producerId}) => {
  const producer = await ProducerDto.get(producerId)
  if (!producer) {
    notFound()
  }
  const canEdit = await ProducerDto.canEdit(user, producerId)
  return <ProducerPane producer={producer} canEdit={canEdit} />
}

export default makeMain({Page, getRoute})
