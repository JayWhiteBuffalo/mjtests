import ImageRefDto from '@data/ImageRefDto'


export const DELETE = async (request, {params}) => {
  const imageRef = await ImageRefDto.get(params.publicId)
  if (!imageRef) {
    return Response.json({}, {status: 404})
  }
  if (!await ImageRefDto.canEdit(user, params.publicId)) {
    return Response.json({}, {status: 403})
  }
  await ImageRefDto.delete(params.publicId)
  return Response.json({}, {status: 204})
}
