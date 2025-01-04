import mongoose from "mongoose";
import Chat from "../models/chat.model.js";
import { getTimeAgo, convertToIST } from "../utils/timestamp-format-utils.js";
import { activeUsers, io } from "../app.js";

const sendMessage = async (req, res) => {
    let message = req.body;
    message._id = new mongoose.Types.ObjectId();
    try {
        let createdMessage = await Chat.create(message);
        let msg =  await Chat.findById(createdMessage._id)
        .populate('sender', 'username email fullName')
        .populate('receiver', 'username email fullName').lean();
        msg.updatedAt = convertToIST(msg.updatedAt);

        io.to(activeUsers[req.body.receiver]).emit('newMessage', msg);


        res.status(201).json({ status: 200, message: msg });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const getMessages = async (req, res) => {
    try {
        let messages = await Chat.find({
            $and: [
                { $or: [{ sender: req.user._id }, { sender: req.query.receiver }] },
                { $or: [{ receiver: req.query.receiver }, { receiver: req.user._id }] }
                
            ]
        })
        .populate('sender', 'username email fullName')
        .populate('receiver', 'username email fullName')
        .lean();

        const chatsWithTimeAgo = messages.map((chat) => ({
            ...chat,
            updatedAt: convertToIST(chat.updatedAt), // Add "time ago"
        }));

        res.status(200).json({ status:200, messages: chatsWithTimeAgo });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { sendMessage, getMessages };