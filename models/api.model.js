import mongoose from 'mongoose';

const apiSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectModule',
        // This categorizes the API under a specific module
    },
    apiName: {
        type: String,
        required: true,
    },
    apiMethod: {
        type: String, // e.g., 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'
        required: true,
    },
    apiEndpoint: {
        type: String,
        required: true,
    },
    apiDescription: {
        type: String,
    },
    apiHeaders: [
        {
            key: String,
            value: String,
            description: String,
        }
    ],
    apiQueryParams: [
        {
            key: String,
            type: {
                type: String, // e.g., 'String', 'Number', 'Boolean'
            },
            description: String,
            required: {
                type: Boolean,
                default: false,
            },
        }
    ],
    apiBody: {
        type: mongoose.Schema.Types.Mixed, // Can store a JSON object/string representation
    },
    apiResponses: [
        {
            statusCode: Number,
            responseBody: mongoose.Schema.Types.Mixed,
            description: String,
        }
    ],
    apiStatus: {
        type: String,
        enum: ['Draft', 'In Progress', 'Completed', 'Deprecated', 'UAT', 'DEV', 'PROD', "QA"],
        default: 'Draft',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

const Api = mongoose.model('Api', apiSchema);

export default Api;
