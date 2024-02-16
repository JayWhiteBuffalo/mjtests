import {apply} from '@app/admin/requests/FormAction'
import {Form} from '@app/admin/requests/Form'
import {getRootPageRouteItem} from '@app/admin/RootPage'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('apply'),
]

const Page = async ({user}) =>
  <Form user={user} action={apply} isAdmin={user.roles.includes('admin')} />

export default makeMain({Page, getRoute})
