import mongoose from 'mongoose';
import User from './user.model.js';

const project = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        unique: true,
    },
    projectName: {
        type: String,
        required: true,
    },
    projectDescription: {
        type: String,
        
    },
    projectManager: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    projectMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    projectTasks: {
        type: Array,
        
    },
    projectStatus: {
        type: String,
        
    },
    isArchived: {
        type: Boolean,
        default: false
    }
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', project);

export default Project;

// Sample JSON for the above schema
const sampleProject = {
    projectId: "12345",
    projectName: "Project Alpha",
    projectDescription: "This is a sample project description.",
    projectManager: "John Doe",
    projectMembers: [
        "672c65952363828105fe1e8d", // Example ObjectId for User
        "672c64f72363828105fe1e84"
    ],
    projectTasks: [
        {
            taskId: "task1",
            taskName: "Design Database",
            taskStatus: "In Progress"
        },
        {
            taskId: "task2",
            taskName: "Develop API",
            taskStatus: "Pending"
        }
    ],
    projectStatus: "Active"
};

