import { v4 as uuidv4 } from "uuid";
import { validationResult, matchedData } from "express-validator";

import prisma from "../utils/prisma.js";
import { errorResponse, successResponse } from "../utils/responsHandler.js";

export const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", {
        code: "VALIDATION_ERROR",
        error: errors.array(),
      });
    } else {
      const data = matchedData(req);
      const project = await prisma.project.create({
        data: {
          uuid: uuidv4(),
          title: data.title,
          description: data.description,
          url_cover: data.url_cover,
          technologies: data.technologies,
          slug: data.slug,
          url_demo: data.url_demo,
          url_github: data.url_github,
          under_development: data.under_development,
          status: data.status,
        },
      });

      successResponse(res, 201, "Successfully create project!", project);
    }
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", {
        code: "VALIDATION_ERROR",
        error: errors.array(),
      });
    } else {
      const data = matchedData(req);

      const projectExists = await prisma.project.findUnique({
        where: {
          uuid: data.uuid,
        },
      });

      if (!projectExists) {
        return errorResponse(res, 404, "Data not found", {
          code: "DATA_NOT_FOUND",
          error: `Project with uuid ${data.uuid} not found`,
        });
      }

      const project = await prisma.project.update({
        where: {
          uuid: data.uuid,
        },
        data: {
          title: data.title,
          description: data.description,
          url_cover: data.url_cover,
          technologies: data.technologies,
          slug: data.slug,
          url_demo: data.url_demo,
          url_github: data.url_github,
          under_development: data.under_development,
          status: data.status,
        },
      });

      successResponse(res, 200, "Successfully update project!", project);
    }
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { uuid } = req.params;

    const projectExists = await prisma.project.findUnique({
      where: {
        uuid,
      },
    });

    if (!projectExists) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `Project with uuid ${uuid} not found`,
      });
    }

    await prisma.project.update({
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

export const getAllProjects = async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    successResponse(res, 200, "Successfully get all projects!", projects);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const getProject = async (req, res) => {
  try {
    const { uuid } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        uuid,
      },
    });

    if (!project || project.deletedAt !== null) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `Project with uuid ${uuid} ${
          project.deletedAt !== null ? "has been deleted" : "not found"
        }`,
      });
    }

    successResponse(res, 200, "Successfully get project!", project);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        slug,
      },
    });

    if (!project || project.deletedAt !== null) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `Project with uuid ${uuid} ${
          project.deletedAt !== null ? "has been deleted" : "not found"
        }`,
      });
    }

    successResponse(res, 200, "Successfully get project!", project);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};
