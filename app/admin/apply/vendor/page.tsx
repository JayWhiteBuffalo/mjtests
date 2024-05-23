import {apply} from '@app/admin/requests/FormAction'
import {Form} from '@app/admin/requests/VendorForm'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
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
