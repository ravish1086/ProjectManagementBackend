import express from "express";
import { 
    createApi, 
    getApis, 
    getApiById, 
    updateApi, 
    deleteApi 
} from "../controllers/api.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authorize, createApi);
router.get("/project/:projectId", authorize, getApis);
router.get("/:id", authorize, getApiById);
router.put("/:id", authorize, updateApi);
router.delete("/:id", authorize, deleteApi);

export default router;
