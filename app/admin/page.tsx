import {Breadcrumb} from '@app/admin/components/Breadcrumb'
import {HiHome} from 'react-icons/hi'
import {makeMain} from '@app/admin/Main'

export const getRoute = async () => [{
  Icon: HiHome,
  name: 'Home',
  segment: 'admin'
}]

const Page = async ({user}) => {
  return (
    <div>Welcome to AdminApp</div>
  )
}

export default makeMain({Page, getRoute})
