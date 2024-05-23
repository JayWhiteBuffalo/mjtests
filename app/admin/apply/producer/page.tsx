import {apply} from '@/feature/admin/request/FormAction'
import {Form} from '@/feature/admin/request/ProducerForm'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {GiBarn} from 'react-icons/gi'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  {
    Icon: GiBarn,
    name: 'Producer',
  },
]

const Page = async ({user}) => (
  <Form user={user} action={apply} isAdmin={user.roles.includes('admin')} />
)

export default makeMain({Page, getRoute})
