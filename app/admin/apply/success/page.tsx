import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'

export const getRoute = async params =>
  [...(await getParentRoute(params)), {
    name: 'Finished',
    segment: 'success',
  }]

const Page = async ({}) =>
  <div>Success</div>

export default makeMain({Page, getRoute})
