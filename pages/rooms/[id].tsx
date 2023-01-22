import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { io } from 'socket.io-client'
let socket: any

const Room = () => {
    // TODO: Use react-query to fetch data

    const router = useRouter()

    // Get id from url
    const { id } = router.query

    // const [room, setRoom] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [text, setText] = useState<string>('')

    const getRoomById = (id: string) => {
        // Make GET request to /api/rooms/:id
        fetch(`/api/rooms/${id}`)
            .then((res) => res.json())
            .then((data) => {
                // Log data
                // console.log(data)

                // Set text from the id
                setText(data.text)
            })
            .catch((err) => {
                // Log error
                console.error(err)

                // Set error
                setError("Room doesn't exist")
            })
    }

    const socketInitializer = async () => {
        await fetch('/api/socket/')
        socket = io()

        socket.on('connect', () => {
            console.log('websocket connected')
        })

        // Join room
        socket.emit('join', id)

        // Listen for changes of update-text
        socket.on('text-updated', (text: string) => {
            // log it
            console.log("Got update text from ws", text)

            // Update text
            setText(text)
        })
    }

    // Get room on mount
    useEffect(() => {
        socketInitializer()
        // Check if id is a string
        if (typeof id === 'string') {
            getRoomById(id)
            // Clear error
            setError(null)
        } else {
            setError("Room doesn't exist")
        }
    }, [id])

    // Update function to change state and emit event
    const updateText = (text: string) => {
        // Update text
        setText(text)

        // Emit update-text event
        console.log("Emitting update-text to room", id)
        socket.emit('update-text', id, text)
    }

    if (error) {
        return (
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
        )
    }

    return (
        <div className="flex-grow w-screen">
            <div className="flex flex-col h-full">
                {/*  Large text area thats writable */}
                <textarea
                    className="flex-grow m-2 p-4 text-2xl font-mono bg-white rounded-lg resize-none focus:outline-0"
                    value={text}
                    // Readonly if id not exist
                    readOnly={id == null}
                    onChange={(e) => {
                        updateText(e.target.value)
                    }}
                />
            </div>
        </div>
    )

}

export default Room