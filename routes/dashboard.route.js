import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getDashboard", authorize, getDashboardData);

export default router;
