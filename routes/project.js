import { Router } from "express";
import * as projectController from "../controller/project.js";
import {
  createProjectSchema,
  updateProjectSchema,
  paramsProjectSchema,
} from "../utils/validation-schema/project.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  createProjectSchema,
  projectController.createProject
);
router.put(
  "/:uuid",
  authenticateToken,
  updateProjectSchema,
  projectController.updateProject
);
router.delete(
  "/:uuid",
  authenticateToken,
  paramsProjectSchema,
  projectController.deleteProject
);
router.get("/", authenticateToken, projectController.getAllProjects);
router.get("/home", projectController.getAllProjects);
router.get(
  "/:uuid",
  authenticateToken,
  paramsProjectSchema,
  projectController.getProject
);

export default router;
