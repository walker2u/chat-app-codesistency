import { app, server } from './lib/socket.js';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectToMongo } from './lib/db.js';
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/mesasge.route.js"

dotenv.config();

const PORT = process.env.PORT;
app.use(express.json({
    limit: "5mb"
}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

server.listen(PORT, () => {
    console.info('Server running on port ', PORT);
    connectToMongo();
});