import {apply} from '@/feature/admin/request/FormAction'
import {Form} from '@/feature/admin/request/VendorForm'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {HiMiniBuildingStorefront} from 'react-icons/hi2'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  {
    Icon: HiMiniBuildingStorefront,
    name: 'Vendor',
  },
]

const Page = async ({user}) => (
  <Form user={user} action={apply} isAdmin={user.roles.includes('admin')} />
)

export default makeMain({Page, getRoute})
