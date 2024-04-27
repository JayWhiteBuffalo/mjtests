
const Layout = ({children}) =>
  <div
    className="flex h-screen w-screen items-center justify-center overflow-hidden bg-content1 p-2 sm:p-4 lg:p-8"
    style={{
      backgroundImage:
        "url(/black-background-texture-2.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {children}
  </div>

export default Layout
