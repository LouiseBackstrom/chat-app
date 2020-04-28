const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const chalk = require('chalk');

const app = express()
const server = http.createServer(app)
const io = socketIO(server)


app.use(express.static('public'))

//Client connection
io.on('connection', (socket) => {
    console.log('User connected: ', socket.id)
    
    socket.on('join room', (data) => {
        socket.join(data.room, () => {
            // Respond that join was a success
            io.to(socket.id).emit('join success', 'success')
            console.log('joined room: ', socket.id)

            // Broadcast message to all clients in the room
            io.to(data.room).emit(
                'new_message',
                {
                    name: data.name,
                    message: `has joined the room!`
                }
            )
        })

    socket.on('new_message', (message) => {
        // Broadcast message to all clients in the room
        io.to(data.room).emit('new_message', { name: data.name, message })
    })
        //Listen on typing
    socket.on('typing', (data) => {
    socket.broadcast.emit('typing', {name: data.name, message})
    })
    })
    
    socket.on('disconnect', (data) => {
        console.log('User disconnected', socket.id)
            socket.leave(data.room, () => {
                // Respond to client that leave was a success
                io.to(socket.id).emit('leave success', 'success')

                console.log('left room: ', socket.id)
                // Broadcast message to all clients in the room
                io.emit(
                    'new_message',
                    {
                        name: data.name,
                        message: `has left the room!`
                    }
                )
            })
        })
    })

server.listen(3000, () => console.log(chalk.blue('Server is running at: http://localhost:3000')))

