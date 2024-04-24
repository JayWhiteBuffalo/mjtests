
const Layout = ({position, children}) =>
  <div
    className="flex h-screen w-screen items-center justify-start overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
    style={{
      backgroundImage:
        "url(/black-background-texture-2.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Brand Logo */}
    <div className="absolute right-10 top-10">
      <div className="flex items-center">
        <p className="font-medium text-white">ACME</p>
      </div>
    </div>

    {/* Testimonial */}
    <div className="absolute bottom-10 right-10 hidden md:block">
      <p className="max-w-xl text-right text-white/60">
        <span className="font-medium">“</span>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget
        augue nec massa volutpat aliquet.
        <span className="font-medium">”</span>
      </p>
    </div>

    {children}
  </div>

export default Layout
