import mongoose from "mongoose";
import Project from "./project.model.js";
import User from "./user.model.js";
const issueSchema = new mongoose.Schema({
    issueProjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'string',
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectModule',
    },
    issueTitle: {
        type: String,
        required: true,
    },
    issueDescription: {
        type: String,
        required: true,
    },
    issueStatus: {
        type: String,
        required: true,
    },
    issuePriority: {
        type: String,
        required: true,
    },
    issueType: {    
        type: String
    },
    issueAssignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    issueDueDate: {
        type: Date,
        required: true,
    },
    issueComments: [
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
    issueAttachments: [
        {
            attachmentName: {
                type: String,
            },
            attachmentUrl: {
                type: String,
            },
        }
    ],
    issueHistory: [
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
    {
        timestamps: true,
    }
);

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;

// Sample JSON for the Issue model
const sampleIssue = {
    issueProject: "672c65952363828105fe1e8d", // Example ObjectId for Project
    issueTitle: "Issue Title",
    issueDescription: "This is a sample issue description.",
    issueStatus: "Open",
    issuePriority: "High",
    issueAssignee: "672c65952363828105fe1e8d", // Example ObjectId for User
    issueDueDate: "2022-12-31",
    issueComments: [
        {
            comment: "This is a sample comment.",
            commentedBy: "672c65952363828105fe1e8d", // Example ObjectId for User
        }
    ],
    issueAttachments: [
        {
            attachmentName: "Sample Attachment",
            attachmentUrl: "http://example.com/attachment.jpg",
        }
    ],
    issueHistory: [
        {
            historyDescription: "Issue created",
            historyBy: "672c65952363828105fe1e8d", // Example ObjectId for User
        }
    ],
};