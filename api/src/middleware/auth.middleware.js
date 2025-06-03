import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const protectedRoute = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) return res.status(400).json({ message: "Unauthorized - No token Provided!" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return res.status(400).json({ message: "Unauthorized - Invalid Token!" });

        const user = User.findById(decoded.userId).select("-password");

        if (!user) return res.status(400).json({ message: "User not Found!" });

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protected Route Function : ", error);
    }
}