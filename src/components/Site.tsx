import Image from 'next/image'

export const Logo = ({...rest}) =>
  <Image
    alt={`${siteName} logo`}
    src="/mjtests-centered.png"
    width={340}
    height={340}
    {...rest}
  />

export const siteName = 'MJTests'

export const companyName = 'MJTests'

export const defaultReturnTo = '/admin'
