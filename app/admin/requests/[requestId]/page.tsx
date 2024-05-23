import BusinessRequestDto from '@data/BusinessRequestDto'
import {approve, reject} from '@feature/admin/request/FormAction'
import {RequestPane} from '@feature/admin/request/Pane'
import {makeMain} from '@/feature/admin/util/Main'
import {notFound} from 'next/navigation'
import {getRoute as getParentRoute} from '../page.tsx'

export const getRoute = async ({requestId, ...params}) => {
  const request = await BusinessRequestDto.get(requestId)
  return [
    ...(await getParentRoute(params)),
    {
      name: `Request from ${request?.user?.email}`,
      segment: requestId,
    },
  ]
}

const Page = async ({user, requestId}) => {
  const request = await BusinessRequestDto.get(requestId)
  if (!request) {
    notFound()
  }

  return (
    <RequestPane
      approve={approve.bind(null, requestId)}
      canEdit={await BusinessRequestDto.canEdit(user, requestId)}
      reject={reject.bind(null, requestId)}
      request={request}
    />
  )
}

export default makeMain({Page, getRoute})
