import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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
    const [textState, setTextState] = useState<string>('')

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

            // // Set room
            // let updatedRoom = room
            // if (updatedRoom) {
            //     updatedRoom.text = text
            // }
            // setRoom(updatedRoom)
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

    // Update text state when room text changes
    useEffect(() => {
        if (room) {
            setTextState(room.text)
        }
    }, [room])


    // Save text to database
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

                // // Emit update-text event
                // console.log("Emitting update-text to room", id)
                // socket.emit('update-text', id, text)
            })
    }

    // // Function to change text "locally"
    // const changeText = (text: string) => {
    //     let upatedRoom = room
    //     if (upatedRoom) {
    //         upatedRoom.text = text
    //     }
    //     setRoom(upatedRoom)
    // }

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
                    value={textState}
                    readOnly={room == null}
                    // On change just change the room text for now
                    onChange={(e) => {
                        // changeText(e.target.value)
                        setTextState(e.target.value)
                    }}
                />

                {/* <div className="bg-red-300 flex-grow m-10"> yo</div> */}

                {/*  Save button */}
                <button
                    className="bg-blue-500 hover:bg-blue-700 my-2 w-64 h-12 self-center text-white font-bold py-2 px-4 rounded"
                    onClick={() => save(textState, id as string)}
                    disabled={room == null}
                >
                    Save
                </button>
            </div>
        </div>
    )

}

export default Room