import Project from '../models/project.model.js';
import Task from '../models/task.model.js';
import Issue from '../models/issue.model.js';
import Discussion from '../models/discussion.model.js';
import Note from '../models/note.model.js';
import { convertToIST, getTimeAgo } from "../utils/timestamp-format-utils.js";

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all active projects for the user
        let projects = await Project.find({
            $and: [
                { isArchived: { $ne: true } },
                { $or: [ 
                    {projectMembers: userId}, 
                    {projectManager: userId}
                ]}
            ]
        }).select('_id');

        const projectIds = projects.map(p => p._id);

        if (projectIds.length === 0) {
            return res.status(200).json({ data: { tasks: [], issues: [], discussions: [], notes: [] } });
        }

        // Fetch tasks
        let tasks = await Task.find({
            projectId: { $in: projectIds },
            $or: [
                { taskMembers: userId },
                { createdBy: userId }
            ]
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

        // Fetch issues
        let issues = await Issue.find({
            issueProjectId: { $in: projectIds },
            $or: [
                { issueAssignee: userId },
                { createdBy: userId }
            ]
        })
        .sort({ createdAt: -1 })
        .populate('issueProjectId', 'projectName')
        .populate('moduleId', 'moduleName')
        .populate('issueAssignee', 'fullName')
        .lean();

        // Fetch discussions
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

        const discussionsWithTimeAgo = discussions.map((discussion) => ({
            ...discussion,
            createdAtAgo: getTimeAgo(discussion.createdAt),
        }));

        // Fetch notes
        let notes = await Note.find({
            projectId: { $in: projectIds },
            userId: userId,
            content: { $ne: '' } // Only fetch notes that have content
        })
        .sort({ date: -1 })
        .populate('projectId', 'projectName')
        .lean();

        res.status(200).json({
            data: {
                tasks: updatedTasks,
                issues: issues,
                discussions: discussionsWithTimeAgo,
                notes: notes
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { getDashboardData };
