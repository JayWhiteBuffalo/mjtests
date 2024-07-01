import UserDto from '@data/UserDto'

export const GET = async (request, {params}) => {
  const user = await UserDto.get(params.userId)
  return Response.json(user, {status: user ? 200 : 404})
}

export const DELETE = async (request, { params }) => {
  const { userId } = params;

  try {
    await UserDto.delete(userId);
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Error deleting user' }), { status: 500 });
  }
}
