import express from "express";
import { 
    createProjectModule, 
    getProjectModules, 
    getProjectModuleById, 
    updateProjectModule, 
    deleteProjectModule 
} from "../controllers/projectModule.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authorize, createProjectModule);
router.get("/project/:projectId", authorize, getProjectModules);
router.get("/:id", authorize, getProjectModuleById);
router.put("/:id", authorize, updateProjectModule);
router.delete("/:id", authorize, deleteProjectModule);

export default router;
