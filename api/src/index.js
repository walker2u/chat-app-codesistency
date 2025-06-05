import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectToMongo } from './lib/db.js';
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/mesasge.route.js"

dotenv.config();

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(PORT, () => {
    console.info('Server running on port ', PORT);
    connectToMongo();
});