import {Cloudinary} from '@cloudinary/url-gen'

export const cloudinaryCloudName = 'dsvfkffwe'
export const cloudinaryApi = new Cloudinary({
  cloud: {
    cloudName: cloudinaryCloudName,
  }
})

