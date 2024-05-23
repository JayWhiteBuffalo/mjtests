import {apply} from '@/feature/admin/request/FormAction.js'
import {Form} from '@/feature/admin/request/ProducerForm.jsx'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@/feature/admin/util/Main.jsx'
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
