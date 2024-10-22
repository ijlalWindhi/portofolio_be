import { v4 as uuidv4 } from "uuid";
import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcrypt";

import prisma from "../utils/prisma.js";
import { errorResponse, successResponse } from "../utils/responsHandler.js";

export const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", {
        code: "VALIDATION_ERROR",
        error: errors.array(),
      });
    } else {
      const data = matchedData(req);

      // Check if email already exists
      const userExists = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });
      if (userExists) {
        return errorResponse(res, 409, "Conflict data", {
          code: "CONFLICT_DATA",
          error: `User with email ${data.email} already exists`,
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          uuid: uuidv4(),
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone?.replace("+62", "0"),
          role: data.role,
        },
      });

      successResponse(res, 201, "Successfully create user!", user);
    }
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation error", {
        code: "VALIDATION_ERROR",
        error: errors.array(),
      });
    } else {
      const data = matchedData(req);

      // Check if user exists
      const userExists = await prisma.user.findUnique({
        where: {
          uuid: data.uuid,
        },
      });
      if (!userExists) {
        return errorResponse(res, 404, "Data not found", {
          code: "DATA_NOT_FOUND",
          error: `User with uuid ${data.uuid} not found`,
        });
      }

      // Check if email already exists
      const getUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            uuid: data.uuid,
          },
        },
      });
      if (getUser) {
        return errorResponse(res, 409, "Conflict data", {
          code: "CONFLICT_DATA",
          error: `User with email ${data.email} already exists`,
        });
      }

      // Hash password
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
      } else {
        delete data.password;
      }

      const user = await prisma.user.update({
        where: {
          uuid: data.uuid,
        },
        data: {
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone?.replace("+62", "0"),
          role: data.role,
        },
      });

      successResponse(res, 200, "Successfully update user!", user);
    }
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;

    const userExists = await prisma.user.findUnique({
      where: {
        uuid,
      },
    });

    if (!userExists) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `User with uuid ${uuid} not found`,
      });
    }

    await prisma.user.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    successResponse(res, 204, "Successfully delete user!");
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    successResponse(res, 200, "Successfully get all users!", users);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { uuid } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!user || user?.deletedAt !== null) {
      return errorResponse(res, 404, "Data not found", {
        code: "DATA_NOT_FOUND",
        error: `User with uuid ${uuid} ${
          user?.deletedAt !== null ? "has been deleted" : "not found"
        }`,
      });
    }

    successResponse(res, 200, "Successfully get user!", user);
  } catch (error) {
    errorResponse(res, 500, "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
      error: error,
    });
  }
};
