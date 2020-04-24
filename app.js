const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const chalk = require('chalk');

const app = express()
const server = http.createServer(app)
const io = socketIO(server)


app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id)
    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
      });

    socket.on('join room', (data) => {
        socket.join(data.room, () => {
            // Respond to client that join was succesfull
            io.to(socket.id).emit('join successful', 'success')

            // Broadcast message to all clients in the room
            io.to(data.room).emit(
                'message',
                {
                    name: data.name,
                    message: `Has joined the room!`
                }
            )
        })

        socket.on('message', (message) => {
            // Broadcast message to all clients in the room
            io.to(data.room).emit('message', { name: data.name, message })
        })
           //listen on new_message
         socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, name: data.name});
    })
            //listen on typing
        socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {name: data.name, message})
    })

    })
    socket.on('disconnect', (socket) => {
        console.log('user disconnected', socket.id)
    })
})

server.listen(3000, () => console.log(chalk.blue('Server is running at: http://localhost:3000')))

