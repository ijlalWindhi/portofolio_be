import { Router } from "express";
import * as projectController from "../controller/project.js";
import {
  createProjectSchema,
  updateProjectSchema,
  paramsProjectSchema,
  paramsTitleSchema,
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
router.get("/home", projectController.getAllProjectsHome);
router.get("/:uuid", paramsProjectSchema, projectController.getProject);
router.get(
  "/slug/:slug",
  paramsTitleSchema,
  projectController.getProjectBySlug
);

export default router;
