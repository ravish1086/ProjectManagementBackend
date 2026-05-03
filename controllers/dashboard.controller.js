import Project from '../models/project.model.js';
import Task from '../models/task.model.js';
import Issue from '../models/issue.model.js';
import Discussion from '../models/discussion.model.js';
import Note from '../models/note.model.js';
import { convertToIST, getTimeAgo } from "../utils/timestamp-format-utils.js";

const getUserProjectIds = async (userId) => {
    const projects = await Project.find({
        $and: [
            { isArchived: { $ne: true } },
            { $or: [{ projectMembers: userId }, { projectManager: userId }] }
        ]
    }).select('_id');
    return projects.map(p => p._id);
};

const getDashboardTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const projectIds = await getUserProjectIds(userId);

        if (projectIds.length === 0) {
            return res.status(200).json({ tasks: [] });
        }

        let tasks = await Task.find({
            projectId: { $in: projectIds },
            taskMembers: userId
        })
        .sort({ createdAt: -1 })
        .populate('projectId', 'projectName')
        .populate('moduleId', 'moduleName')
        .populate('taskMembers', 'fullName')
        .populate('createdBy', 'fullName')
        .lean();

        const updatedTasks = tasks.map((task) => ({
            ...task,
            taskDueDate: new Date(task.taskDueDate).toDateString(),
            createdAt: convertToIST(task.createdAt)
        }));

        res.status(200).json({ tasks: updatedTasks });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getDashboardIssues = async (req, res) => {
    try {
        const userId = req.user._id;
        const projectIds = await getUserProjectIds(userId);

        if (projectIds.length === 0) {
            return res.status(200).json({ issues: [] });
        }

        let issues = await Issue.find({
            issueProjectId: { $in: projectIds },
            issueAssignee: userId
        })
        .sort({ createdAt: -1 })
        .populate('issueProjectId', 'projectName')
        .populate('moduleId', 'moduleName')
        .populate('issueAssignee', 'fullName')
        .lean();

        res.status(200).json({ issues });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getDashboardDiscussions = async (req, res) => {
    try {
        const userId = req.user._id;
        const projectIds = await getUserProjectIds(userId);

        if (projectIds.length === 0) {
            return res.status(200).json({ discussions: [] });
        }

        let discussions = await Discussion.find({
            discussionForProject: { $in: projectIds },
            $or: [
                { discussionMembers: userId },
                { createdBy: userId }
            ]
        })
        .sort({ createdAt: -1 })
        .populate('discussionForProject', 'projectName')
        .populate('moduleId', 'moduleName')
        .populate('discussionMembers', 'fullName')
        .populate('createdBy', 'fullName')
        .lean();

        const discussionsWithTimeAgo = discussions.map((d) => ({
            ...d,
            createdAtAgo: getTimeAgo(d.createdAt),
        }));

        res.status(200).json({ discussions: discussionsWithTimeAgo });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getDashboardNotes = async (req, res) => {
    try {
        const userId = req.user._id;
        const projectIds = await getUserProjectIds(userId);

        if (projectIds.length === 0) {
            return res.status(200).json({ notes: [] });
        }

        let notes = await Note.find({
            projectId: { $in: projectIds },
            userId: userId,
            content: { $ne: '' }
        })
        .sort({ date: -1 })
        .populate('projectId', 'projectName')
        .lean();

        res.status(200).json({ notes });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { getDashboardTasks, getDashboardIssues, getDashboardDiscussions, getDashboardNotes };
