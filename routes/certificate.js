import { Router } from "express";

import * as certificateController from "../controller/certificate.js";
import {
  createCertificateSchema,
  updateCertificateSchema,
  paramsCertificateSchema,
} from "../utils/validation-schema/certificate.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  createCertificateSchema,
  certificateController.createCertificate
);
router.put(
  "/:uuid",
  authenticateToken,
  updateCertificateSchema,
  certificateController.updateCertificate
);
router.delete(
  "/:uuid",
  authenticateToken,
  paramsCertificateSchema,
  certificateController.deleteCertificate
);
router.get("/", authenticateToken, certificateController.getAllCertificates);
router.get("/home", certificateController.getAllCertificates);
router.get(
  "/:uuid",
  authenticateToken,
  paramsCertificateSchema,
  certificateController.getCertificate
);

export default router;
