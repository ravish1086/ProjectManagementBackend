import express from "express";
import { getDashboardTasks, getDashboardIssues, getDashboardDiscussions, getDashboardNotes } from "../controllers/dashboard.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/tasks", authorize, getDashboardTasks);
router.get("/issues", authorize, getDashboardIssues);
router.get("/discussions", authorize, getDashboardDiscussions);
router.get("/notes", authorize, getDashboardNotes);

export default router;
