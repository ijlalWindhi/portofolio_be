import { v4 as uuidv4 } from "uuid";
import { validationResult, matchedData } from "express-validator";

import prisma from "../utils/prisma.js";
import { errorResponse, successResponse } from "../utils/responsHandler.js";

const jobTypeMapping = {
  fullTime: "Full Time",
  partTime: "Part Time",
  contract: "Contract",
  internship: "Internship",
  volunteer: "Volunteer",
  temporary: "Temporary",
  freelance: "Freelance",
};

const locationTypeMapping = {
  remote: "Remote",
  onSite: "Onsite",
  hybrid: "Hybrid",
};

export const createCareer = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", {
        code: "VALIDATION_ERROR",
        error: errors.array(),
      });
    } else {
      const data = matchedData(req);
      const career = await prisma.career.create({
        data: {
          uuid: uuidv4(),
          position: data.position,
          company: data.company,
          logo: data.logo,
          location: data.location,
          location_type: data.location_type,
          type: data.type,
          start_date: data.start_date,
          end_date: data.end_date,
          link: data.link,
        },
      });

      successResponse(res, 201, "Successfully create career!", career);
    }
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const updateCareer = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", {
        code: "VALIDATION_ERROR",
        error: errors.array(),
      });
    } else {
      const data = matchedData(req);

      const careerExists = await prisma.career.findUnique({
        where: {
          uuid: data.uuid,
        },
      });

      if (!careerExists) {
        return errorResponse(res, 404, "Data not found", {
          code: "DATA_NOT_FOUND",
          error: `Career with uuid ${data.uuid} not found`,
        });
      }

      const career = await prisma.career.update({
        where: {
          uuid: data.uuid,
        },
        data: {
          position: data.position,
          company: data.company,
          logo: data.logo,
          location: data.location,
          location_type: data.location_type,
          type: data.type,
          start_date: data.start_date,
          end_date: data.end_date,
          link: data.link,
        },
      });

      successResponse(res, 200, "Successfully update career!", career);
    }
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const { uuid } = req.params;

    const careerExists = await prisma.career.findUnique({
      where: {
        uuid,
      },
    });

    if (!careerExists) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `Career with uuid ${uuid} not found`,
      });
    }

    await prisma.career.update({
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

export const getAllCareers = async (_req, res) => {
  try {
    const careers = await prisma.career.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    careers.map((career) => {
      career.type = jobTypeMapping[career.type];
      career.location_type = locationTypeMapping[career.location_type];
    });

    successResponse(res, 200, "Successfully get all careers!", careers);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const getCareer = async (req, res) => {
  try {
    const { uuid } = req.params;

    const career = await prisma.career.findUnique({
      where: {
        uuid,
      },
    });

    if (!career || career.deletedAt !== null) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `Career with uuid ${uuid} ${
          career.deletedAt !== null ? "has been deleted" : "not found"
        }`,
      });
    }

    successResponse(res, 200, "Successfully get career!", career);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};
