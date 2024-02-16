import UserDto from '@data/UserDto'

export const GET = async (request, {params}) => {
  const user = await UserDto.get(params.userId)
  return Response.json(user, {status: user ? 200 : 404})
}
