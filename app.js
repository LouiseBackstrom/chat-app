const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const chalk = require("chalk");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
let rooms = [
    //room with password created for testing
    {
        id: "Livingroom",
        password: "password",
    },
];

console.log("rooms", rooms);

app.use(express.static("public"));

app.get("/rooms"),
    (req, res) => {
        res.json(rooms);
    };

//Client connection
io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);
    //Broadcast all rooms to all clients
    io.emit("rooms", getAllRooms());

    // socket.on('create room', (data) => {
    //     socket.join(data.room, () => {
    //         rooms.push({
    //             name: data.room,
    //             password: data.password
    //         })
    //     })
    // })

    // data =  {name, room, password}
    socket.on("join room", (data) => {
        var index = rooms.findIndex((room) => room.id === data.room);

        // if room doesn't exists then index is -1,  create & join
        if (index === -1) {
            rooms.push({
                id: data.room,
                password: data.password,
            });
        } // room already exists check password
        else if (data.password !== rooms[index].password) {
            // if not correct password send error
            socket.emit("wrong password", "Uncorrect password");
            console.log("fel lösen");
            
            return; // then return
        }
        
        //if password is correct join, if not show error message
        socket.join(data.room, () => {
            io.emit("rooms", getAllRooms());
            // Respond that join was a success
            socket.emit("join success", "success");
            io.to(data.room).emit("new_message", {
                name: data.name,
                message: `has joined the room!`,
            });

            socket.on("new_message", (message) => {
                // Broadcast message to all clients in the room
                io.to(data.room).emit("new_message", { name: data.name, message });
            });
        });
    },

    socket.on("leave room", () => {
        socket.leaveAll();
          // sync rooms variable with socket.io rooms
        const socketRooms = getAllRooms();
         // exempel socketRooms = ["rum 1"] 
        // rooms = [{id: "rum 1", password: "123"}, {id: "rum 2", password: ""}] 
        rooms = rooms.filter(room => socketRooms.includes(room.id))

        //Broadcast all rooms to all clients
        io.emit("rooms", getAllRooms()); 
    })
  );


socket.on("disconnect", (data) => {
    console.log("User disconnected", socket.id);
    socket.leaveAll();
    // sync rooms variable with socket.io rooms
    const socketRooms = getAllRooms();
    rooms = rooms.filter(room => socketRooms.includes(room.id))

    //Broadcast all rooms to all clients
    io.emit("rooms", getAllRooms()); 
});
});

function getAllRooms() {
    const roomsAndSocketIds = Object.keys(io.sockets.adapter.rooms);
    const socketIds = Object.keys(io.sockets.sockets);
    const rooms = roomsAndSocketIds.filter(
        (roomOrId) => !socketIds.includes(roomOrId)
    );
    console.log(rooms);
    return rooms;
}

server.listen(3000, () =>
    console.log(chalk.blue("Server is running at: http://localhost:3000"))
);
