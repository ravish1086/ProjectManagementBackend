import Note from '../models/note.model.js';

const getNote = async (req, res) => {
    try {
        const { projectId, date } = req.query;
        const userId = req.user._id;

        if (!projectId || !date) {
            return res.status(400).json({ message: "projectId and date are required" });
        }

        let note = await Note.findOne({ projectId, userId, date });
        
        if (!note) {
            // Return an empty note structure if none exists for this date
            return res.status(200).json({ data: { content: '' } });
        }

        res.status(200).json({ data: note });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const saveNote = async (req, res) => {
    try {
        const { projectId, date, content } = req.body;
        const userId = req.user._id;

        if (!projectId || !date) {
            return res.status(400).json({ message: "projectId and date are required" });
        }

        let note = await Note.findOneAndUpdate(
            { projectId, userId, date },
            { content },
            { new: true, upsert: true } // Create if it doesn't exist
        );

        res.status(200).json({ message: "Note saved successfully", data: note });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { getNote, saveNote };
