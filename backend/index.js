const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);
//estructura para usuarios en sala
const usersInRoom = {}; // { roomName: [username1, username2, ...] }

const io = new Server(server, {
    cors: {
        origin: [
            "https://socketr-3.onrender.com",  // Aquí va la URL pública de tu frontend en Render
            "http://localhost:5173"            // Para desarrollo local (opcional)
        ],
        methods: ["GET", "POST"]
    }
})




io.on("connection", (socket) => {
    console.log(`Usuario actual: ${socket.id}`);

    //socket.on("join_room", (data) => {
        //socket.join(data);
        //console.log(`Usuario con ID: ${socket.id} se unio a la sala: ${data}`);
    //});

    socket.on("join_room", ({ room, username }) => {
        socket.join(room);
        socket.username = username;
        socket.room = room;

        // Manejar usuarios conectados
        if (!usersInRoom[room]) usersInRoom[room] = [];
        if (!usersInRoom[room].includes(username)) usersInRoom[room].push(username);

        // Enviar lista de usuarios actualizada a todos los de la sala
        io.in(room).emit("users_list", usersInRoom[room]);
        console.log(`Usuario ${username} se unió a la sala: ${room}`);
    });


    socket.on("send_message", (data) => {
        //socket.to(data.room).emit("receive_message", data);
        //cambio sugerido
        io.in(data.room).emit("receive_message", data); 
        console.log(`Mensaje en sala ${data.room}: ${data.author}: ${data.message}`);
    });


    socket.on("disconnect", () => {
        const { room, username} = socket
        if (room && usersInRoom[room]) {
            usersInRoom[room] = usersInRoom[room].filter(u => u !== username);
            io.in(room).emit("users_list", usersInRoom[room]);
            console.log(`Usuario ${username} salió de la sala: ${room}`);
        }

        console.log("Usuario desconectado", socket.id);
    });
           
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log("servidor corriendo en el puerto ${port}");
});