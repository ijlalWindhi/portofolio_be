import { v4 as uuidv4 } from "uuid";
import { validationResult, matchedData } from "express-validator";

import prisma from "../utils/prisma.js";
import { errorResponse, successResponse } from "../utils/responsHandler.js";

export const createCertificate = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", {
        code: "VALIDATION_ERROR",
        error: errors.array(),
      });
    } else {
      const data = matchedData(req);
      const certificate = await prisma.certificate.create({
        data: {
          uuid: uuidv4(),
          title: data.title,
          url: data.url,
        },
      });

      successResponse(
        res,
        201,
        "Successfully create certificate!",
        certificate
      );
    }
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", {
        code: "VALIDATION_ERROR",
        error: errors.array(),
      });
    } else {
      const data = matchedData(req);

      const certificateExists = await prisma.certificate.findUnique({
        where: {
          uuid: data.uuid,
        },
      });

      if (!certificateExists) {
        return errorResponse(res, 404, "Data not found", {
          code: "DATA_NOT_FOUND",
          error: `Certificate with uuid ${data.uuid} not found`,
        });
      }

      const certificate = await prisma.certificate.update({
        where: {
          uuid: data.uuid,
        },
        data: {
          title: data.title,
          url: data.url,
        },
      });

      successResponse(
        res,
        200,
        "Successfully update certificate!",
        certificate
      );
    }
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const { uuid } = req.params;

    const certificateExists = await prisma.certificate.findUnique({
      where: {
        uuid,
      },
    });

    if (!certificateExists) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `Certificate with uuid ${uuid} not found`,
      });
    }

    await prisma.certificate.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    successResponse(res, 204, "Successfully delete certificate!");
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const getAllCertificates = async (_req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    successResponse(
      res,
      200,
      "Successfully get all certificates!",
      certificates
    );
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { uuid } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: {
        uuid,
      },
    });

    if (!certificate || certificate?.deletedAt !== null) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `Certificate with uuid ${uuid} ${
          certificate?.deletedAt !== null ? "has been deleted" : "not found"
        }`,
      });
    }

    successResponse(res, 200, "Successfully get certificate!", certificate);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};
