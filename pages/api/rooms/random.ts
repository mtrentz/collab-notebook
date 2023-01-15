import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../prisma/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // if method not POST, not allowed
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }
    // if method is POST, create a new, empty room
    const room = await prisma.room.create({
        data: {
            text: '',
        }
    })

    res.status(200).json(room)
}


