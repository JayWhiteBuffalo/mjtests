import backgroundImage from '@/public/black-background-texture-2.jpg'
import type {ReactNode} from 'react'

const Layout = ({children}: {children: ReactNode}) => (
  <div
    className="flex h-screen w-screen items-center justify-center overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
    style={{
      backgroundImage: `url(${backgroundImage.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {children}
  </div>
)

export default Layout
