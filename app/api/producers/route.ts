// import ProducerDto from '@/data/ProducerDto'
// import UserDto from '@/data/UserDto'

// export const GET = async (request, {params}) => {
//   const producer = await ProducerDto._getAll()
//   console.log(producer)
//   return Response.json(producer, {status: producer ? 200 : 404})
// }

import { NextApiRequest, NextApiResponse } from 'next'  
import { Prisma } from '@prisma/client'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch the producers from the database
      const producers = await Prisma.producer.findMany()

      // Send the producers data as a response
      res.status(200).json(producers)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to fetch producers' })
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}