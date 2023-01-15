import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

export default function Home() {

  const router = useRouter()

  const createRandomRoom = () => {
    // Make POST request to /api/rooms/random
    fetch('/api/rooms/random', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        // Log data
        console.log(data)

        // Navigate to /rooms/:id
        router.push(`/rooms/${data.id}`)
      })
  }

  const textRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen py-2">
          {/* Button to create random room */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => createRandomRoom()}
          >
            Create Random Room
          </button>

          {/* Text field and button to go to room*/}
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="text"
            placeholder="Room ID"
            id="room-id"
            ref={textRef}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/rooms/${textRef.current?.value}`)}
          >
            Get Room
          </button>
        </div>
      </main>
    </>
  )
}
