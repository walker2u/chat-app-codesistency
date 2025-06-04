import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectToMongo } from './lib/db.js';

import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/mesasge.route.js"

dotenv.config();

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(PORT, () => {
    console.info('Server running on port ', PORT);
    connectToMongo();
});