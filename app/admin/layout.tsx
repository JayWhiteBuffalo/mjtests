import './Admin.css'
import '@app/globals.css'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import type {Metadata} from 'next'
import UserDto from '@data/UserDto'
import {AdminNavbar} from './components/Navbar'
import {AdminSidebar} from './components/Sidebar'
import {ColorSchemeScript} from '@mantine/core'
import {Inter} from 'next/font/google'
import {Providers} from './Providers'
import {siteName} from '@components/Site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${siteName} Management Console`,
  description: 'Management console for the biggest weed market in Oklahoma',
}

const RootLayout = async ({children}) => {
  const user = await UserDto.getCurrent()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="AdminGrid grid min-h-screen">
            <AdminNavbar
              user={user}
              style={{gridArea: 'navbar'}}
            />
            <AdminSidebar
              user={user}
              style={{gridArea: 'sidebar'}}
            />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
