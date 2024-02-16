import ProducerDto from '@data/ProducerDto'
import {getRootPageRouteItem} from '@app/admin/RootPage'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
import {ProducerTable} from './Table'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('producers'),
]

const Page = async ({user}) => {
  let producers
  if (user.roles.includes('admin')) {
    producers = await ProducerDto.findMany()
  } else if (user.roles.includes('producer')) {
    producers = await ProducerDto.findMany({
      where: {
        users: {
          some: {userId: user.id},
        },
      },
    })
  } else {
    producers = []
  }

  return <ProducerTable producers={producers} />
}

export default makeMain({Page, getRoute})
