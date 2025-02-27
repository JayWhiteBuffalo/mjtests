import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {siteName} from '@/feature/shared/component/Site'
import {AlertBox} from '@/feature/shared/component/Form'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  {
    name: 'Success',
    segment: 'success',
  },
]

const Page = async () => (
  <AlertBox color="green-500 m-8">
    <span>
      Thank you for applying with {siteName}!. We will contact you shortly about
      your application.
    </span>
  </AlertBox>
)

export default makeMain({Page, getRoute})
