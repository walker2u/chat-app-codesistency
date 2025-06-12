import http from "http";
import express from 'express';
import { Server } from "socket.io"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
});

io.on('connection', (socket) => {
    console.log('someone connected! ', socket.id);

    socket.on("disconnect", () => {
        console.log('someone disconnected! ', socket.id);
    });
});

export { io, server, app };