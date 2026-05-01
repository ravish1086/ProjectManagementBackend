import ProjectModule from "../models/projectModule.model.js";

const createProjectModule = async (req, res) => {
    try {
        const { projectId, moduleName } = req.body;
        
        if (!projectId || !moduleName) {
            return res.status(400).json({ message: "projectId and moduleName are required." });
        }

        const projectModule = new ProjectModule({
            ...req.body,
            createdBy: req.user?._id,
        });

        const createdModule = await projectModule.save();
        return res.status(201).json({ status: 201, message: "Project module created successfully", data: createdModule });
    } catch (error) {
        return res.status(500).json({ message: "Error creating project module", error: error.message });
    }
};

const getProjectModules = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        if (!projectId) {
            return res.status(400).json({ message: "projectId is required as a route parameter." });
        }

        const modules = await ProjectModule.find({ projectId })
            .populate('createdBy', 'username email fullName')
            .populate('updatedBy', 'username email fullName')
            .sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, data: modules });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching project modules", error: error.message });
    }
};

const getProjectModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const moduleItem = await ProjectModule.findById(id);

        if (!moduleItem) {
            return res.status(404).json({ message: "Project module not found." });
        }

        return res.status(200).json({ status: 200, data: moduleItem });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching project module", error: error.message });
    }
};

const updateProjectModule = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedModule = await ProjectModule.findByIdAndUpdate(
            id, 
            { 
                ...req.body, 
                updatedBy: req.user?._id,
                moduleUpdatedAt: Date.now()
            }, 
            { new: true, runValidators: true }
        );

        if (!updatedModule) {
            return res.status(404).json({ message: "Project module not found." });
        }

        return res.status(200).json({ status: 200, message: "Project module updated successfully", data: updatedModule });
    } catch (error) {
        return res.status(500).json({ message: "Error updating project module", error: error.message });
    }
};

const deleteProjectModule = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedModule = await ProjectModule.findByIdAndDelete(id);

        if (!deletedModule) {
            return res.status(404).json({ message: "Project module not found." });
        }

        return res.status(200).json({ status: 200, message: "Project module deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting project module", error: error.message });
    }
};

export { 
    createProjectModule, 
    getProjectModules, 
    getProjectModuleById, 
    updateProjectModule, 
    deleteProjectModule 
};
