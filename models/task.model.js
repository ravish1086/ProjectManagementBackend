import mongoose, { Mongoose } from "mongoose";
import User from "./user.model.js";
import Project from "./project.model.js";
import ProjectModule from "./projectModule.model.js";
const taskSchema = new mongoose.Schema({
    projectId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectModule',
    },
    taskId: {
        type: String,
        required: true,
    },
    taskName: {
        type: String,
        required: true,
    },
    taskDescription: {
        type: String,
    },
    taskStatus: {
        type: String,
        required: true,
    },
    taskMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    taskDueDate: {
        type: Date,
        required: true,
    },
    taskPriority: {
        type: String,
        required: true,
    },
    taskComments: [
        {
            comment: {
                type: String,
            },
            commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            commentedAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    taskAttachments: [
        {
            attachmentName: {
                type: String,
            },
            attachmentUrl: {
                type: String,
            },
        }
    ],
    taskHistory: [
        {
            historyDescription: {
                type: String,
            },
            historyBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            historyAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    taskCreatedAt: {
        type: Date,
        default: Date.now,
    },
    taskUpdatedAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;

// Sample JSON for the above schema
const sampleTask = {
    projectId: "12345",
    taskId: "task1",
    taskName: "Design Database",
    taskDescription: "This task involves designing the database schema for the project.",
    taskStatus: "In Progress",
    taskMembers: [
        "672c65952363828105fe1e8d", // Example ObjectId for User
        "672c64f72363828105fe1e84"
    ],
    taskDueDate: "2022-12-31",
    taskPriority: "High",
    taskComments: [
        {
            comment: "This is a sample comment.",
            commentedBy: "672c65952363828105fe1e8d",
        }
    ],
    taskAttachments: [
        {
            attachmentName: "Database Schema",
            attachmentUrl: "http://example.com/database-schema.pdf",
        }
    ],
    taskHistory: [
        {
            historyDescription: "Task created",
            historyBy: "672c65952363828105fe1e8d",
        }
    ],
    taskCreatedAt: "2022-12-01T12:00:00Z",
    taskUpdatedAt: "2022-12-01T12:00:00Z",
};