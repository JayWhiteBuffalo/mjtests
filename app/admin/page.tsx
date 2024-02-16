'use server'
import {HiHome} from 'react-icons/hi'
import {Breadcrumb} from '@app/admin/components/Breadcrumb'

export const getRoute = async () => [{
  Icon: HiHome,
  name: 'Home',
  segment: 'admin'
}]

export default async ({}) => {
  return (
    <>
      <Breadcrumb items={await getRoute()} />
      <div>Welcome to AdminApp</div>
    </>
  )
}

