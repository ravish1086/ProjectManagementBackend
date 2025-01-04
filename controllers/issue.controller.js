import mongoose from "mongoose";
import Issue from "../models/issue.model.js";
import { io } from "../app.js";
import { activeUsers } from "../app.js";
import { createNotification } from "./notification.controller.js";

const createIssue = async (req, res) => {
    let issue = req.body;
    issue.issueId = new mongoose.Types.ObjectId();
    issue._id = issue.issueId;
    try {
        let createdIssue = await Issue.create(issue);
        let notification = {
            title: issue.issueTitle,
            message: issue.issueDescription,
            users: issue.issueAssignee,
            entityId: createdIssue._id,
            entityType: "Issue"
        }
        let notif = await createNotification(notification);
        issue.issueAssignee.forEach((assignee) => {
            if(activeUsers[assignee]) {
                io.to(activeUsers[assignee]).emit('newNotification', {
                    title: notification.title,
                    message: notification.message
                });
            }
        });
        if (createdIssue) {
            res.status(201).json({ message: "Issue created", issue: createdIssue });
        }
        else {
            res.status(400).json({ message: "Issue not created" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getIssues = async (req, res) => {
    try {
        let issues = await Issue.find({issueProjectId:req.query.projectId}).sort({ createdAt: -1 }).populate('issueAssignee', 'username email fullName role');
        if (issues) {
            res.status(200).json({ issues: issues });
        }
        else {
            res.status(404).json({ message: "Issues not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { createIssue, getIssues };