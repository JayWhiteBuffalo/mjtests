import {HiHome} from 'react-icons/hi'
import {makeMain} from '@app/admin/Main'
import {siteName} from '@components/Site'

export const getRoute = async () => [{
  Icon: HiHome,
  name: 'Home',
  segment: 'admin'
}]

const Page = async ({}) => {
  return (
    <div>Welcome to ${siteName} Management Console!</div>
  )
}

export default makeMain({Page, getRoute})
