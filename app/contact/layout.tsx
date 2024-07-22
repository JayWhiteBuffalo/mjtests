import type {Metadata} from 'next'
import {Providers} from './Providers'
import {Header} from '@/feature/shop/component/Nav/Header'
import {FooterBar, FooterNav} from '@/feature/shop/component/Footer'
import UserDto from '@/data/UserDto'

export const metadata: Metadata = {
  title: 'Treemap Weed Marketplace',
  description: 'The biggest weed market in Oklahoma',
}

const user = UserDto.getCurrent(); // Ensure this works with async if necessary

const Layout = ({children}) => 
<Providers>
  <Header user={user}/>
  {children}
  <FooterNav/>
  <FooterBar/>
</Providers>

export default Layout
