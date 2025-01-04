import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.utils.js";
import { activeUsers } from "../app.js";

const authenticateUser = async (req, res) => {
    req.body.username = req.body.username.toLowerCase();
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user);
        res.status(200).json({status:200, message: "User authenticated", user:user, token: token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    req.body.username = req.body.username.toLowerCase();
    req.body.password = await bcrypt.hash(req.body.password, 10);
    try {
        let searchResult = await User.findOne({ username: req.body.username })
        if (searchResult) {
            return res.status(400).json({ message: "Username already exists" });
        }
        let createdUser = await User.create(req.body) 
        if(createdUser) {   
            res.status(201).json({ message: "User created", user: createdUser });
        }
        else {
            res.status(400).json({ message: "User not created" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

 
};

const updateUser = async (req, res) => {
    req.body.username = req.body.username.toLowerCase();
    req.body.password = await bcrypt.hash(req.body.password, 10);
    try {
        let searchResult = await User.findOne({ username: req.body.username })
        if (searchResult) {
            // return res.status(400).json({ message: "Username already exists" });
            let result = await User.findOneAndUpdate({ username: req.body.username }, req.body);
            if(result) {
                res.status(200).json({ message: "User updated", user: result });
            }
            else
             res.status(400).json({ message: "User not updated" });

        }
        else {
            res.status(400).json({ message: "User not updated" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        let users = await User.find()
        .sort({ createdAt: -1 });
        if (users) {
            res.status(200).json({ users: users });
        }
        else {
            res.status(404).json({ message: "Users not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getActiveUsers = async (req, res) => {
    try {
        let users = await User.find()
        .sort({ createdAt: -1 }).lean();
        Object.keys(activeUsers).forEach((activeUser) => {
            users.forEach((user) => {
                if (activeUser == user._id) {
                    user.active = true;
                }
            });
        });
        if (users) {
            res.status(200).json({ users: users });
        }
        else {
            res.status(404).json({ message: "Users not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { authenticateUser, createUser, updateUser, getUsers, getActiveUsers };