import {apply} from '@app/admin/requests/FormAction'
import {Form} from '@app/admin/requests/ProducerForm'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
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
