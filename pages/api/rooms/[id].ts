import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

import { prisma } from '../../../prisma/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // if method not GET, not allowed
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    // Get ID from URL
    const id = req.query.id

    // Try to find room with that ID
    const room = await prisma.room.findUnique({
        where: {
            id: id as string,
        },
    })

    // If room not found, return 404
    if (!room) {
        res.status(404).json({ message: 'Room not found' })
        return
    }

    // If room found, return room
    res.status(200).json(room)
}


