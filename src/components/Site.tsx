import Image from 'next/image'
import logoImage from '@/public/mjtests-340px.png'

export const Logo = ({...rest}) =>
  <Image
    alt={`${siteName} logo`}
    src={logoImage.src}
    width={340}
    height={340}
    {...rest}
  />

export const siteName = 'MJTests'

export const companyName = 'MJTests'

export const defaultReturnTo = '/admin'
