import mongoose from 'mongoose';
import Project from './project.model.js';

const projectModuleSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    moduleName: {
        type: String,
        required: true,
    },
    moduleCreatedAt: {
        type: Date,
        default: Date.now,
    },
    moduleUpdatedAt: {
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
    }
});

const ProjectModule = mongoose.model('ProjectModule', projectModuleSchema);

export default ProjectModule;
