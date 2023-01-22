import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../prisma/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // if method not GET, not allowed
    if (req.method == 'GET') {
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

        // Return room
        res.status(200).json(room)
    }
    // If PUT
    else if (req.method == 'PUT') {
        // Update room
        const id = req.query.id
        const room = await prisma.room.update({
            where: {
                id: id as string,
            },
            data: {
                text: req.body.text,
            },
        })

        // Return updated room
        res.status(200).json(room)
    } else {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }



}


