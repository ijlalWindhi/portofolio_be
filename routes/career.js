import { Router } from "express";

import * as careerController from "../controller/career.js";
import {
  createCareerSchema,
  updateCareerSchema,
  paramsCareerSchema,
} from "../utils/validation-schema/career.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  createCareerSchema,
  careerController.createCareer
);
router.put(
  "/:uuid",
  authenticateToken,
  updateCareerSchema,
  careerController.updateCareer
);
router.delete(
  "/:uuid",
  authenticateToken,
  paramsCareerSchema,
  careerController.deleteCareer
);
router.get("/", authenticateToken, careerController.getAllCareers);
router.get("/home", careerController.getAllCareersHome);
router.get(
  "/:uuid",
  authenticateToken,
  paramsCareerSchema,
  careerController.getCareer
);

export default router;
