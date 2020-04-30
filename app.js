const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const chalk = require('chalk');

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const userData = {}
const rooms = []
const password = ""

app.use(express.static('public'))


//Client connection
io.on('connection', (socket) => {
    console.log('User connected: ', socket.id)
     //Broadcast all rooms to all clients
    io.emit('rooms', getAllRooms())


    socket.on('create room', (data) => {
        socket.join(data.room, () => {
            rooms.push({ 
                name: data.room, 
                password: data.password 
            })
        })
    })

    socket.on('join room', (data) => {

        // Finns rummet?
        let index = rooms.findIndex((room) => {
            return room.name == data.room.name
        })
       
        // Finns rum, jämför lösenord, om ej, skapa nytt rum
        if (data.password !== rooms[index].password){
          
         }

        socket.join(data.room, () => {
            // save data on join room
    
            //if room has password on join
 
            userData[socket.id] = {name: data.name, room: data.room, password: data.password}
            // if room has no password create room
            //rooms[data.room] = {password: data.password}
            
         
            // Respond that join was a success
            io.to(socket.id).emit('join success', 'success')
            io.to(data.room).emit(
                'new_message',
                {
                    name: data.name,
                    message: `has joined the room!`
                }
            )
            // Broadcast message to all clients in the room
           

            //Broadcast all rooms to all clients
            io.emit('rooms', getAllRooms())
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
        
        //Broadcast all rooms to all clients
        io.emit('rooms', getAllRooms())
        })
    })

function getAllRooms() {
    const roomsAndSocketIds  = Object.keys(io.sockets.adapter.rooms)    
    const socketIds = Object.keys(io.sockets.sockets)
    const rooms = roomsAndSocketIds.filter(roomOrId => !socketIds.includes(roomOrId))
    console.log(rooms)
    return rooms
}

function getUsersInRoom(roomName) {
    const room = io.sockets.adapter.rooms[roomName]
    const socketIds = Object.keys(room.sockets)

    const usersInRoom = socketIds.map(id => users[id])
    console.log(room)
}


server.listen(3000, () => console.log(chalk.blue('Server is running at: http://localhost:3000')))

