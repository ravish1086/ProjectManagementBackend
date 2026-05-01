import mongoose from "mongoose";
import Task from "../models/task.model.js";
import {convertToIST } from "../utils/timestamp-format-utils.js";
import { createNotification } from "./notification.controller.js";
import Notification from "../models/notification.model.js";
import { io } from "../app.js";
import { activeUsers } from "../app.js";

const createTask = async (req, res) => {
    let task = req.body;
    task._id = new mongoose.Types.ObjectId();
    task.taskId = task._id;
    task.createdBy = req.user._id;
    if(req.file) {
    task.taskAttachments = [{
        attachmentName: req.file?req.file.filename:'',
        attachmentUrl: req.file?req.file.path:''
    }];
    }
    
    const taskMembers = Array.isArray(req.body['taskMembers'])
      ? req.body['taskMembers']
      : [req.body['taskMembers']]; 
    const membersArray = taskMembers.map((id) => new mongoose.Types.ObjectId(id));

    task.taskMembers = membersArray;
    
    // console.log(task.taskMembers.split(','));
    // const taskMembers = Array.isArray(req.body['taskMembers'])
    //   ? req.body['taskMembers']
    //   : [req.body['taskMembers']]; // Ensure it's an array
    // console.log(taskMembers, req.body);
    try {
        let createdTask = await Task.create(task);
        let notification = {
            title: task.taskName,
            message: task.taskDescription,
            users: membersArray,
            entityId: createdTask._id,
            entityType: "Task"
        }
        
        let notif = await createNotification(notification);
        
        taskMembers?.forEach((member) => {
            if(activeUsers[member]) {
                io.to(activeUsers[member]).emit('newNotification', {
                    title: notification.title,
                    message: notification.message
                });
            }
        });

        if (createdTask && notif) {
            res.status(201).json({ message: "Task created and user notified", task: createdTask });
        }
        else {
            res.status(400).json({ message: "Task not created" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getTasks = async (req, res) => {
    try {
        let dueType = req.query.dueType;
        let now = new Date();
        let todaysStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let todaysEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        let tasks;
        if(dueType === 'Overdue') {
            tasks = await Task.find({
                projectId: req.query.projectId,
                taskDueDate: { $lt: todaysStartDate }
            })
            .sort({ createdAt: -1 })
            .populate('taskMembers', 'username email fullName role')
            .populate('createdBy', 'username email fullName role')
            .populate('moduleId', 'moduleName').lean();
        }
        else if(dueType === 'Today') {
            tasks = await Task.find({
                projectId: req.query.projectId,
                taskDueDate: { $gte: todaysStartDate, $lt: todaysEndDate }
            })
            .sort({ createdAt: -1 })
            .populate('taskMembers', 'username email fullName role')
            .populate('createdBy', 'username email fullName role')
            .populate('moduleId', 'moduleName').lean();
        }
        else{
            tasks = await Task.find({projectId: req.query.projectId})
            .sort({ createdAt: -1 })
            .populate('taskMembers', 'username email fullName role')
            .populate('createdBy', 'username email fullName role')
            .populate('moduleId', 'moduleName').lean();
        }
        const updatedTasks = tasks.map((task) => ({
            ...task,
            taskDueDate: new Date(task.taskDueDate).toDateString(),
            createdAt: convertToIST(task.createdAt) // Add "time ago"
        }));

        if (tasks) {
            res.status(200).json({ tasks: updatedTasks });
        }
        else {
            res.status(404).json({ message: "Tasks not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.query.taskId);
        if (task) {
            res.status(200).json({ message: "Task deleted" });
        }
        else {
            res.status(200).json({ message: "Task not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateTask = async (req, res) => {
    let task = req.body;
    console.log(req.body);

    task._id = new mongoose.Types.ObjectId(req.body._id);
    task.updatedBy = req.user._id;
    if(req.file) {
    task.taskAttachments = [{
        attachmentName: req.file?req.file.filename:'',
        attachmentUrl: req.file?req.file.path:''
    }];
    }
    console.log(req.body);
    const taskMembers = Array.isArray(req.body['taskMembers'])
      ? req.body['taskMembers']
      : [req.body['taskMembers']]; 
    const membersArray = taskMembers.map((id) => new mongoose.Types.ObjectId(id));

    task.taskMembers = membersArray;
    try {
        let updatedTask = await Task.findByIdAndUpdate(task._id, task);
        let notification = {
            title: task.taskName,
            message: task.taskDescription,
            users: membersArray,
            entityId: updatedTask._id,
            entityType: "Task"
        }
        
        let notif = await createNotification(notification);
        
        taskMembers?.forEach((member) => {
            if(activeUsers[member]) {
                io.to(activeUsers[member]).emit('newNotification', {
                    title: notification.title,
                    message: notification.message
                });
            }
        });

        if (updatedTask ) {
            res.status(200).json({ message: "Task updated", task: updatedTask });
        }
        else {
            res.status(400).json({ message: "Task not updated", task: updatedTask });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { createTask, getTasks, deleteTask, updateTask };