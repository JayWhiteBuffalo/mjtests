import ArrayUtil from '@util/ArrayUtil'
import clsx from 'clsx'
import {cloudinaryCloudName} from '@/api'
import {Image} from '@components/Image'
import {Dropzone, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import {Group, Text, rem} from '@mantine/core';
import {RecursiveErrors} from '@components/Form'
import {TbUpload, TbPhoto, TbX, TbTrash} from 'react-icons/tb';
import {useCallback, useState} from 'react'

const upload = async file => {
  const formData = new FormData()
  formData.append('upload_preset', 'p3a2uwxz')
  formData.append('tags', 'dev')
  formData.append('file', file)
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`, {
    method: 'POST',
    body: formData,
  })
  return await response.json()
}

const Item = ({publicId, selected, onDelete, ...rest}) =>
  <li className="relative">
    <button
      {...rest}
      type="button"
      className={clsx(
        'box-content w-[360px] h-60 border-4 rounded-lg overflow-hidden',
        selected ? 'border-blue-400' : 'border-transparent',
    )}>
      <Image
        alt="Uploaded image"
        width={360}
        height={240}
        sizes="360px"
        publicId={publicId}
       />
    </button>
    <button type="button" className="absolute right-2 top-2" onClick={onDelete}>
      <TbTrash className="w-6 h-6" />
    </button>
  </li>

export const ImageInput = ({mainImageRefId, imageRefs: initialImageRefs, errors, imageRefFields, onChange, ...rest}) => {
  const [imageRefs, setImageRefs] = useState(initialImageRefs)

  const onDrop = useCallback(async files => {
    const xs = await Promise.all(files.map(upload))

    const newImageRefs = xs.map((data, ix) => ({
      ...imageRefFields,
      assetId: data.asset_id,
      fileSize: data.bytes,
      lastModified: files[ix].lastModified,
      originalFilename: files[ix].name,
      publicId: data.public_id,
      size: [data.width, data.height],
    }))
    setImageRefs(imageRefs => [...imageRefs, ...newImageRefs])
    await fetch(`/api/imagerefs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({imageRefs: newImageRefs}),
    })
    if (mainImageRefId == null && imageRefs.length === 0) {
      onChange(newImageRefs[0].publicId)
    }
  }, [onChange, mainImageRefId, imageRefs, imageRefFields])

  const onDelete = useCallback(async index => {
    setImageRefs(ArrayUtil.splice(imageRefs, index, 1))
    const imageRef = imageRefs[index]

    if (imageRef.publicId === mainImageRefId) {
      onChange((imageRefs[index + 1] ?? imageRefs[index - 1])?.publicId)
    }
    await fetch(`/api/imagerefs/${imageRef.publicId}`, {method: 'DELETE'})
  }, [onChange, imageRefs, mainImageRefId])

  return (
    <>
      <Dropzone
        onDrop={onDrop}
        onReject={files => console.warn('DropzoneInput rejected files', files)}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        {...rest}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <TbUpload
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <TbX
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <TbPhoto
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      <ul className="flex overflow-x-scroll">
        {imageRefs.map(({publicId}, ix) =>
          <Item
            key={publicId}
            onClick={() => onChange(publicId)}
            onDelete={() => onDelete(ix)}
            publicId={publicId}
            selected={mainImageRefId === publicId}
            />
        )}
      </ul>

      <RecursiveErrors errors={errors} />
    </>
  );
}
