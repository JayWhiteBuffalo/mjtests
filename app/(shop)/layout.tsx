import type {Metadata} from 'next'
import {Providers} from './Providers'
import {Header} from '@/feature/shop/component/Nav/Header'
import UserDto from '@/data/UserDto'
import {FooterBar, FooterNav} from '@/feature/shop/component/Footer'

export const metadata: Metadata = {
  title: 'Treemap Weed Marketplace',
  description: 'The biggest weed market in Oklahoma',
}

// const user = UserDto.getCurrent();

const Layout = ({children}) => 
<Providers>
  {/* <Header user={user}/> */}
  <main className='relative mt-16'>
    {children}
  </main>
  <section className='relative'>
    <FooterNav/>
    <FooterBar/>
  </section>
</Providers>

export default Layout
