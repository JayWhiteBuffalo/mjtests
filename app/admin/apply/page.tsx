import {getRootPageRouteItem} from '@app/admin/RootPage'
import {getRoute as getParentRoute} from '../page.tsx'
import {redirect} from 'next/navigation'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('apply'),
]

export default () => redirect('/business')
