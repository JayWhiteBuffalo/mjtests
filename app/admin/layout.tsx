import '../globals.css'
import './Admin.css'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import clsx from 'clsx'
import type {Metadata} from 'next'
import UserDto from '@data/UserDto'
import {AdminNavbar} from './components/Navbar'
import {AdminSidebar} from './components/Sidebar'
import {ColorSchemeScript} from '@mantine/core'
import {createTheme, MantineProvider} from '@mantine/core';
import {Inter} from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Treemap Management Console',
  description: 'Management console for the biggest weed market in Oklahoma',
}

const theme = createTheme({

})

export default async ({children}) => {
  const user = await UserDto.getCurrent()

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={clsx(inter.className, 'AdminBody')}>
        <MantineProvider theme={theme}>
          <AdminNavbar user={user} />
          <AdminSidebar user={user} />
          <main className="AdminMain">
            {children}
          </main>
        </MantineProvider>
      </body>
    </html>
  )
}