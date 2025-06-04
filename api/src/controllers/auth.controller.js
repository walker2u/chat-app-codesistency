import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!password || !email) return res.status(400).json({ message: "Please fill all the required fields!" });

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "Invalid Credentials!" });
        const correctPassword = bcrypt.compareSync(password, user.password);
        if (!correctPassword) return res.status(404).json({ message: "Invalid Credentials!" });

        generateToken(user._id, res);
        res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in signup controller :- ", error);
        res.status(500).json({ message: `Error Login user! ${error}` });
    }
}
export const signup = async (req, res) => {
    try {
        const { fullname, email, password, profilePic } = req.body;

        if (!fullname || !password || !email) return res.status(400).json({ message: "Please fill all the required fields!" });

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "Email already exists!" });

        if (password.length < 6) return res.status(400).json({ message: "Password should be at least six characters long!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPass = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPass,
            profilePic
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
    } catch (error) {
        console.log("Error in signup controller :- ", error);
        res.status(500).json({ message: `Error creating user! ${error}` });
    }
}
export const logout = (req, res) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json({ message: "Logout Successfull!" });
    } catch (error) {
        console.log("Error in logout! ", error);
        res.status(500).json({ message: `Error in logout ${error}` });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.file;
        if (!profilePic) return res.status(400).json({ message: `Please provide a Profile Pic!` });

        const userId = req.user._id;

        const cloudinaryResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: cloudinaryResponse.secure_url
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile! ", error);
        res.status(500).json({ message: `Error in update profile ${error}` });
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth! ", error);
        res.status(500).json({ message: `Error in check auth ${error}` });
    }
}