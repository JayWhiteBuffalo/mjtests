import ImageRefDto from '@data/ImageRefDto'
import UserDto from '@data/UserDto'

export const POST = async request => {
  const user = await UserDto.getCurrent()
  const data = await request.json()
  const imageRefs = await Promise.all(data.imageRefs.map(imageRef =>
    ImageRefDto.create({
      ...imageRef,
      uploadedById: user.id,
      lastModified: new Date(imageRef.lastModified),
    })
  ))
  return Response.json(imageRefs)
}
