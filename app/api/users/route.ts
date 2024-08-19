
import UserDto from '@/data/UserDto.ts'

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            try {
                const user = await UserDto.getCurrent()
                res.status(200).json(user)
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch user' })
            }
            break
        // Add more cases for other HTTP methods (POST, PUT, DELETE) as needed
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
