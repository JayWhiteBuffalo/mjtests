import ProducerDto from '@/data/ProducerDto'
import UserDto from '@/data/UserDto'

export const GET = async (request, {params}) => {
  const producer = await ProducerDto.get(params.producerId)
  return Response.json(producer, {status: producer ? 200 : 404})
}


export const DELETE = async (request, { params }) => {
    const { producerId } = params;
    try {
      const user = await UserDto.getCurrent()
      if (!await ProducerDto.canDelete(user)) {
        return new Response(JSON.stringify({ message: 'Permission denied' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      await ProducerDto.delete(producerId)
      return new Response(JSON.stringify({ message: 'Producer deleted successfully' }), { status: 200 });
    } catch (error) {
      console.error('Error deleting Producer:', error)
      return new Response(JSON.stringify({ message: 'Error deleting Producer' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }