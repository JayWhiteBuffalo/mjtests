import './Admin.css'
import type {Metadata} from 'next'
import UserDto from '@data/UserDto'
import {AdminNavbar} from '@feature/admin/component/Navbar'
import {AdminSidebar} from '@feature/admin/component/Sidebar'
import {Providers} from './Providers'
import {siteName} from '@/feature/shared/component/Site'

export const metadata: Metadata = {
  title: `${siteName} Management Console`,
  description: 'Management console for the biggest weed market in Oklahoma',
}

export const Layout = async ({children}) => {
  const user = await UserDto.getCurrent()

  return (
    <Providers>
      <div className="AdminGrid grid min-h-screen">
        <AdminNavbar user={user} style={{gridArea: 'navbar'}} />
        <AdminSidebar user={user} style={{gridArea: 'sidebar'}} />
        {children}
      </div>
    </Providers>
  )
}

export default Layout