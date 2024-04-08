import '@app/globals.css'
import type {Metadata} from 'next'
import {customTheme} from './Theme'
import {Flowbite} from 'flowbite-react'
import {Inter} from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Treemap Weed Marketplace',
  description: 'The biggest weed market in Oklahoma',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Flowbite theme={{theme: customTheme}}>
          {children}
        </Flowbite>
      </body>
    </html>
  )
}
