import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js"

export const login = (req, res) => {
    res.send('login')
}
export const signup = async (req, res) => {
    try {
        const { fullname, email, password, profilePic } = req.body;
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
    res.send('logout')
}