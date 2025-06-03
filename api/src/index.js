import express from 'express';
import authRouter from "./routes/auth.route.js";
import dotenv from 'dotenv';
import { connectToMongo } from './lib/db.js';
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.info('Server running on port ', PORT);
    connectToMongo();
});