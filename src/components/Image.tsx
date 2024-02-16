import {cloudinaryCloudName} from '@/api'
import NextImage from 'next/image'

export const cloudinaryLoader = ({src, width, quality}) => {
  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')]
  return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${params.join(',')}/${src}`
}

export const Image = ({...rest}) =>
  <NextImage
    {...rest}
    loader={cloudinaryLoader}
   />