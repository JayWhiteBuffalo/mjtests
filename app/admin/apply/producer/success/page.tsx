import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
import {siteName} from '@components/Site'
import {AlertBox} from '@components/Form'

export const getRoute = async params =>
  [...(await getParentRoute(params)), {
    name: 'Success',
    segment: 'success',
  }]

const Page = async ({}) =>
  <AlertBox color="green-500 m-8">
    <span>Thank you for applying with {siteName}!. We will contact you shortly about your application.</span>
  </AlertBox>

export default makeMain({Page, getRoute})
