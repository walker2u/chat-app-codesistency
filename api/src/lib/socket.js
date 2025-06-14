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

const userSocketMap = {};

function getUserSocketId(userId) {
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    console.log('someone connected! ', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log('someone disconnected! ', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app, getUserSocketId };