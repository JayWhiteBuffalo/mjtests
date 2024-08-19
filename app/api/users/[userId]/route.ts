import UserDto from '@data/UserDto'

// GET method to fetch a user by ID
export const GET = async (request, { params }) => {
  const user = await UserDto.get(params.userId)
  return new Response(JSON.stringify(user), { status: user ? 200 : 404 })
}

// DELETE method to delete a user by ID
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
