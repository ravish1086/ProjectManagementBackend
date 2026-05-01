import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
    discussionId: {
        type: String,
        required: true,
        unique: true,
    },
    discussionForProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectModule',
    },
    discussionTitle: {
        type: String,
        required: true,
    },
    discussionDescription: {
        type: String,
        required: true,
    },
    discussionMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    discussionComments: [
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
    discussionAttachments: [
        {
            attachmentName: {
                type: String,
            },
            attachmentUrl: {
                type: String,
            },
        }
    ],
    discussionType: {
        type: String,
        required: true,
    },
    discussionOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
    {
        timestamps: true,
    }
);

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;

const dummyDiscussion = {
    discussionId: "12345",
    discussionForProject: "507f1f77bcf86cd799439011",
    discussionTitle: "Project Kickoff",
    discussionDescription: "Initial discussion for project kickoff",
    discussionMembers: [
        "507f1f77bcf86cd799439012",
        "507f1f77bcf86cd799439013"
    ],
    discussionComments: [
        {
            comment: "Looking forward to this project!",
            commentedBy: "507f1f77bcf86cd799439014",
            commentedAt: new Date()
        },
        {
            comment: "Let's schedule a meeting.",
            commentedBy: "507f1f77bcf86cd799439015",
            commentedAt: new Date()
        }
    ],
    discussionAttachments: [
        {
            attachmentName: "ProjectPlan.pdf",
            attachmentUrl: "http://example.com/ProjectPlan.pdf"
        },
        {
            attachmentName: "Budget.xlsx",
            attachmentUrl: "http://example.com/Budget.xlsx"
        }
    ],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    discussionType: "General",
    createdAt: new Date(),
    updatedAt: new Date()
};

export { dummyDiscussion };