import type {Metadata} from 'next'
import {Providers} from './Providers'

export const metadata: Metadata = {
  title: 'Treemap Weed Marketplace',
  description: 'The biggest weed market in Oklahoma',
}

export const Layout = ({children}) =>
  <Providers>
    {children}
  </Providers>

export default Layout
