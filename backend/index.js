const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

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

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`Usuario con ID: ${socket.id} se unio a la sala: ${data}`);
    });

    socket.on("send_message", (data) => {
        //socket.to(data.room).emit("receive_message", data);
        //cambio sugerido
        io.in(data.room).emit("receive_message", data); 
    });


    socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id);
    });
           
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log("servidor corriendo en el puerto ${port}");
});