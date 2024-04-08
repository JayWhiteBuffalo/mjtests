import ArrayUtil from '@util/ArrayUtil'
import clsx from 'clsx'
import {cloudinaryCloudName} from '@/api'
import {FixedHeightImage} from '@components/Image'
import {Dropzone, IMAGE_MIME_TYPE} from '@mantine/dropzone';
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
  <li className="relative flex-none group">
    <button
      type="button"
      className={clsx(
        'box-content border-4 rounded-lg overflow-hidden',
        selected ? 'border-blue-400' : 'border-transparent',
      )}
      {...rest}>
      <FixedHeightImage
        alt="Uploaded image"
        height={240}
        publicId={publicId}
      />
    </button>
    <button
      className="absolute right-2 top-2 group-hover:opacity-100 opacity-0 group-hover:visible invisible"
      onClick={onDelete}
      type="button">
      <TbTrash className="w-6 h-6" />
    </button>
  </li>

export const ImageDropzone = ({onDrop, ...rest}) =>
  <Dropzone
    onDrop={onDrop}
    onReject={files => console.warn('DropzoneInput rejected files', files)}
    accept={IMAGE_MIME_TYPE}
    maxSize={10 << 20}
    {...rest}
  >
    <Dropzone.Idle>
      <TbPhoto className="w-12 h-12 dimmed mt-2" strokeWidth={2} />
    </Dropzone.Idle>
    <Dropzone.Accept>
      <TbUpload className="w-12 h-12 text-blue-600 mt-2" strokeWidth={2} />
    </Dropzone.Accept>
    <Dropzone.Reject>
      <TbX className="w-12 h-12 text-red-600 mt-2" strokeWidth={2} />
    </Dropzone.Reject>

    <div>
      <p className="text-lg">
        Drag images here, or click to select
      </p>
      <p className="text-sm text-neutral-400">
        Supported formats: .png / .gif / .jpeg / .webp / .avif / .heic
      </p>
      <p className="text-sm text-neutral-400">
        Max 10mb
      </p>
    </div>
  </Dropzone>

export const ImageInput = ({mainImageRefId, imageRefs: initialImageRefs, errors, imageRefFields, onChange}) => {
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
      <ImageDropzone onDrop={onDrop} />

      <ul className="flex overflow-x-scroll gap-2 p-2">
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
