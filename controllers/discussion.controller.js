import mongoose from "mongoose";
import Discussion from "../models/discussion.model.js";
import {getTimeAgo} from "../utils/timestamp-format-utils.js";

const createDiscussion = async (req, res) => {
    let discussion = req.body;
    discussion.discussionId = new mongoose.Types.ObjectId();
    discussion.createdBy = req.user._id;
    try {
        let createdDiscussion = await Discussion.create(discussion);
        if (createdDiscussion) {
            res.status(201).json({ message: "Discussion created", discussion: createdDiscussion });
        }
        else {
            res.status(400).json({ message: "Discussion not created" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateDiscussion = async (req, res) => {
    let discussion = req.body;
    try {
        let updatedDiscussion = await Discussion.findByIdAndUpdate(discussion._id, discussion, { new: true });
        if (updatedDiscussion) {
            res.status(200).json({ message: "Discussion updated", discussion: updatedDiscussion });
        }
        else {
            res.status(400).json({ message: "Discussion not updated", discussion: updatedDiscussion });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getDiscussions = async (req, res) => {
    try {
        let moduleId = req.query.moduleId;
        let query = { discussionForProject: req.query.projectId };
        if (moduleId && moduleId !== 'ALL') {
            query.moduleId = moduleId;
        }

        let discussions = await Discussion.find(query)
        .sort({ createdAt: -1 })
        .populate('discussionMembers', 'username email fullName role')
        .populate('discussionComments.commentedBy', 'username email fullName role')
        .populate('discussionOwner', 'username email fullName role')
        .populate('createdBy', 'username email fullName role designation')
        .populate('moduleId', 'moduleName').lean();
        
        const discussionsWithTimeAgo = discussions.map((discussion) => ({
            ...discussion,
            createdAtAgo: getTimeAgo(discussion.createdAt), // Add "time ago"
          }));
      

        if (discussions) {
            res.status(200).json({ discussions: discussionsWithTimeAgo });
        }
        else {
            res.status(404).json({ message: "Discussions not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteDiscussion = async (req, res) => {
    try {
        let discussion = await Discussion.findByIdAndDelete(req.query.discussionId);
        if (discussion) {
            res.status(200).json({ message: "Discussion deleted" });
        }
        else {
            res.status(200).json({ message: "Discussion not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { createDiscussion, getDiscussions, updateDiscussion, deleteDiscussion };