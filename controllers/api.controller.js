import Api from "../models/api.model.js";

const createApi = async (req, res) => {
    try {
        const { projectId, apiName, apiMethod, apiEndpoint } = req.body;

        if (!projectId || !apiName || !apiMethod || !apiEndpoint) {
            return res.status(400).json({ message: "projectId, apiName, apiMethod, and apiEndpoint are required." });
        }

        const newApi = new Api({
            ...req.body,
            createdBy: req.user?._id,
        });

        const createdApi = await newApi.save();
        return res.status(201).json({ status: 201, message: "API details created successfully", data: createdApi });
    } catch (error) {
        return res.status(500).json({ message: "Error creating API details", error: error.message });
    }
};

const getApis = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { moduleId } = req.query; // Optional filter by module

        if (!projectId) {
            return res.status(400).json({ message: "projectId is required as a route parameter." });
        }

        let query = { projectId };
        if (moduleId) {
            query.moduleId = moduleId;
        }

        const apis = await Api.find(query)
            .populate('moduleId', 'moduleName')
            .populate('createdBy', 'username email fullName')
            .populate('updatedBy', 'username email fullName')
            .sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, data: apis });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching APIs", error: error.message });
    }
};

const getApiById = async (req, res) => {
    try {
        const { id } = req.params;
        const apiItem = await Api.findById(id)
            .populate('moduleId', 'moduleName');

        if (!apiItem) {
            return res.status(404).json({ message: "API not found." });
        }

        return res.status(200).json({ status: 200, data: apiItem });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching API", error: error.message });
    }
};

const updateApi = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedApi = await Api.findByIdAndUpdate(
            id,
            { 
                ...req.body, 
                updatedBy: req.user?._id 
            },
            { new: true, runValidators: true }
        );

        if (!updatedApi) {
            return res.status(404).json({ message: "API not found." });
        }

        return res.status(200).json({ status: 200, message: "API details updated successfully", data: updatedApi });
    } catch (error) {
        return res.status(500).json({ message: "Error updating API details", error: error.message });
    }
};

const deleteApi = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedApi = await Api.findByIdAndDelete(id);

        if (!deletedApi) {
            return res.status(404).json({ message: "API not found." });
        }

        return res.status(200).json({ status: 200, message: "API details deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting API details", error: error.message });
    }
};

export {
    createApi,
    getApis,
    getApiById,
    updateApi,
    deleteApi
};
