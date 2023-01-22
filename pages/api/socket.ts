import { Server } from 'socket.io'


const SocketHandler = (
    req: any,
    res: any
) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', (socket) => {
            console.log('Socket connected')
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            // Join room
            socket.on('join', (roomId) => {
                // Check if roomId
                if (roomId) {
                    socket.join(roomId)
                    console.log('User', socket.id, 'joined room', roomId)
                }
            })

            // Broadcast text update
            socket.on('update-text', (roomId, text) => {
                // Log it
                console.log('User', socket.id, 'updated text in room', roomId, 'to', text)

                // Broadcast to room, not to sender
                socket.to(roomId).emit('text-updated', text)
            })
        })

    }
    res.end()
}

export default SocketHandler