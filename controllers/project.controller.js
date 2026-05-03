import Project from "../models/project.model.js";
import mongoose from "mongoose";

const createProject = async (req, res) => {
    let project = req.body;
    project.projectId = new mongoose.Types.ObjectId();
    try {
        let createdProject = await Project.create(project);
        if (createdProject) {
            res.status(201).json({ status:200, message: "Project created", project: createdProject });
        }
        else {
            res.status(400).json({ message: "Project not created" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getProjects = async (req, res) => {
    try {
        let projects = await Project.find({
            $and: [
                { isArchived: { $ne: true } },
                { $or: [ 
                    {projectMembers: req.user._id}, 
                    {projectManager: req.user._id}
                ]}
            ]
        })
        .sort({ createdAt: -1 })
        .populate('projectMembers', 'username email fullName role designation')
        .populate('projectManager', 'username email fullName role _id designation');
        if (projects) {
            res.status(200).json({ projects: projects });
        }
        else {
            res.status(404).json({ message: "Projects not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateProject = async (req, res) => {
    try {
        let project = await Project.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
        if (project) {
            res.status(200).json({ status: 200, message: "Project updated", project: project });
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { createProject, getProjects, updateProject };