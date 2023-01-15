import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Notepad from '@/components/Notepad'

// Socket io stuff
import { io } from 'socket.io-client'
let socket: any

interface Room {
    id: string
    createdAt: string
    text: string
}

const Room = () => {
    // TODO: Use react-query to fetch data

    const router = useRouter()

    // Get id from url
    const { id } = router.query

    const [room, setRoom] = useState<Room | null>(null)
    const [error, setError] = useState<string | null>(null)

    const getRoomById = (id: string) => {
        // Make GET request to /api/rooms/:id
        fetch(`/api/rooms/${id}`)
            .then((res) => res.json())
            .then((data) => {
                // Log data
                // console.log(data)

                // Set room
                setRoom(data)
            })
            .catch((err) => {
                // Log error
                console.error(err)

                // Set error
                setError("Room doesn't exist")
            })
    }

    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io()

        socket.on('connect', () => {
            console.log('websocket connected')
        })

        // Join room
        socket.emit('join-room', id)

        // Listen for changes of update-text
        socket.on('text-updated', (text: string) => {
            // log it
            console.log("Got update text from ws", text)

            // Set room
            let updatedRoom = room
            if (updatedRoom) {
                updatedRoom.text = text
            }
            setRoom(updatedRoom)
        })
    }

    // Get room on mount
    useEffect(() => {
        // Initialize socket if not initialized
        if (!socket) {
            socketInitializer()
        }

        // Check if id is a string
        if (typeof id === 'string') {
            getRoomById(id)
            // Clear error
            setError(null)
        } else {
            setError("Room doesn't exist")
        }
    }, [id])


    const save = (text: string, id: string) => {
        // PUT request to /api/rooms/:id
        fetch(`/api/rooms/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        })
            .then((res) => res.json())
            .then((data) => {
                // Log data
                // console.log(data)

                // Set room
                setRoom(data)

                // Emit update-text event
                console.log("Emitting update-text")
                socket.emit('update-text', text, id)
            })
    }


    return (
        // Show error if error
        error ? (
            <div className="flex-grow">
                <div className="flex flex-col gap-4 items-center justify-center min-h-screen py-2">
                    <h1 className="text-2xl font-bold">{error}</h1>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => router.push('/')}
                    >
                        Go back
                    </button>
                </div>
            </div>
        ) : (
            <div className="flex-grow w-screen">
                {/* // Show notepad */}
                <Notepad
                    id={room?.id || ''}
                    text={room?.text || ''}
                    saveText={save}
                    // Editable if room loaded (not null or undefined)
                    editable={room != null}
                />
            </div>
        )
    )
}

export default Room