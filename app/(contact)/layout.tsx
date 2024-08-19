import type {Metadata} from 'next'
import {Providers} from './Providers'
import {Header} from '@/feature/shop/component/Nav/Header'
import {FooterBar, FooterNav} from '@/feature/shop/component/Footer'


export const metadata: Metadata = {
  title: 'Treemap Weed Marketplace',
  description: 'The biggest weed market in Oklahoma',
}



const Layout = ({ children }) => 



<Providers>
  <Header/>
  {children}
  <FooterNav/>
  <FooterBar/>
</Providers>
;

export default Layout

