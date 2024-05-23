import backgroundImage from '@/public/black-background-texture-2.jpg'

const Layout = ({children}) => (
  <div
    className="flex h-screen w-screen items-center justify-center overflow-hidden bg-content1 p-2 sm:p-4 lg:p-8"
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
