import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToMongo = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.info("Connected to Mongo DB!", conn.connection.host)
    } catch (error) {
        console.log('Error connecting to mongo db :- ', error)
    }
}