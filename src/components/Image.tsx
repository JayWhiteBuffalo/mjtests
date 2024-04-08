import {cloudinaryCloudName} from '@/api'
import NextImage from 'next/image'
import {forwardRef, useCallback, useState} from 'react'

export const cloudinaryLoader = ({src, width, quality}) => {
  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')]
  return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${params.join(',')}/${src}`
}

export const Image = ({publicId, src,...rest}) =>
  <NextImage
    src={src ?? publicId}
    loader={publicId ? cloudinaryLoader : undefined}
    {...rest}
  />

export const ImageOrFallback = forwardRef(({alt, size, src, className, onLoad, ...rest}, ref) =>
  src
    ? <Image
        alt={alt}
        className={clsx('object-contain object-center bg-gray-100', className)}
        height={size[1]}
        onLoad={onLoad}
        radius="none"
        ref={ref}
        src={supabaseImageUrl(src, size[0])}
        style={{ width: size[0], height: size[1] }}
        width={size[0]}
        {...rest}
      />
    : <div
        className={clsx('flex flex-wrap justify-center content-center', className)}
        ref={ref}
        style={{ width: size[0], height: size[1] }}
        {...rest}
      >
        <p className="text-center p-2">{alt}</p>
      </div>
)
ImageOrFallback.displayName = 'ImageOrFallback'

export const scaleToFixedHeight = height => naturalSize => {
  const size = [Math.round((naturalSize[0] / naturalSize[1]) * height), height]
  return [Math.min(Math.max(height / 2, size[0]), height * 2), size[1]]
}

export const FixedHeightImage = forwardRef(
  ({ size: intitialSize, height = 300, alt, onResize, ...rest }, ref) => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    const toFixedHeight = useCallback(scaleToFixedHeight(height), [height])
    const [size, setSize] = useState(toFixedHeight(intitialSize ?? [10, 16]))

    const onLoad = useCallback(
      (event) => {
        const newSize = toFixedHeight([
          event.target.naturalWidth,
          event.target.naturalHeight,
        ])
        setSize(newSize)
        onResize?.(newSize)
      },
      [onResize, toFixedHeight]
    );

    return (
      <Image
        alt={alt}
        height={size[1]}
        onLoad={onLoad}
        ref={ref}
        style={{width: size[0], height: size[1]}}
        width={size[0]}
        {...rest}
      />
    )
  }
)
FixedHeightImage.displayName = "FixedHeightImage";
