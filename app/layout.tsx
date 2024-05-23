import '@app/globals.css'
import type {Metadata} from 'next'
import {ColorSchemeScript} from '@mantine/core'
import {Inter} from 'next/font/google'
import {type ReactNode} from 'react'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Treemap Weed Marketplace',
  description: 'The biggest weed market in Oklahoma',
}

export const RootLayout = ({children}: {children: ReactNode}) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <ColorSchemeScript />
    </head>
    <body className={inter.className}>{children}</body>
  </html>
)

export default RootLayout
