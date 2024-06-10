import type {Metadata} from 'next'
import {Providers} from './Providers'
import {NavBar} from '@/feature/shared/component/NavBar';

export const metadata: Metadata = {
  title: 'Treemap Weed Marketplace',
  description: 'The biggest weed market in Oklahoma',
}

export const Layout = ({children}) => 
    <Providers>
        <NavBar/>
            {children}
    </Providers>

export default Layout

