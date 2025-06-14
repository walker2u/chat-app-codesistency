import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getUserSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const filteredUser = await User.find({ _id: { $ne: loggedInUser._id } }).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error in getting users :- ", error.message);
        res.status(500).json({ message: "Internal Server error!" });
    }
}

export const getMessagesForOneUser = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { id: targetUserId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, recieverId: targetUserId },
                { senderId: targetUserId, recieverId: loggedInUserId }
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getting mesages in getMessagesForOneUser :- ", error.message);
        res.status(500).json({ message: "Internal Server error!" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const loggedInUserId = req.user._id;
        const { id: targetUserId } = req.params;

        let imageUrl;
        if (image) {
            const res = await cloudinary.uploader.upload(image);
            imageUrl = res.secure_url;
        }

        const messages = await Message.create({
            senderId: loggedInUserId,
            recieverId: targetUserId,
            text,
            image: imageUrl
        });
        await messages.save();

        //socket io implementation
        const targetUserSocketId = getUserSocketId(targetUserId);
        if (targetUserSocketId) {
            io.to(targetUserSocketId).emit('newMessage', messages);
        }

        res.status(201).json(messages);
    } catch (error) {
        console.log("Error in getting mesages in sendMessage :- ", error.message);
        res.status(500).json({ message: "Internal Server error!" });
    }
}