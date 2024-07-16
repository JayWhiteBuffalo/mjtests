import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {redirect} from 'next/navigation'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('/'),
]

export default () => redirect('/')