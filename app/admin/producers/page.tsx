import ProducerDto from '@data/ProducerDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage.js'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@/feature/admin/util/Main.jsx'
import {ProducerTable} from '@feature/admin/producer/Table.jsx'

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
      orderBy: {name: 'asc'},
    })
  } else {
    producers = []
  }

  return <ProducerTable producers={producers} />
}

export default makeMain({Page, getRoute})
