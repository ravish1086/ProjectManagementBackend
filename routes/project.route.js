import express from "express";
import { getProjects, createProject, updateProject } from "../controllers/project.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/getProjects", authorize, getProjects);
router.post("/createProject", authorize, createProject);
router.put("/:id", authorize, updateProject);


export default router;