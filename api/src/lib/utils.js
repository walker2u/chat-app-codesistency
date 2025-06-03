import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
        algorithm: 'HS256'
    });
    res.cookie("access_token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "developement"
    });
    return token
}