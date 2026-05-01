import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: '',
    }
}, {
    timestamps: true
});

noteSchema.index({ projectId: 1, userId: 1, date: 1 }, { unique: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;
