import { body, param } from "express-validator";

export const createProjectSchema = [
  body("title").isString().notEmpty().escape().trim(),
  body("description").isString().notEmpty().escape().trim(),
  body("url_cover").isString().notEmpty().trim(),
  body("technologies").isArray().notEmpty(),
  body("slug").isString().notEmpty().escape().trim(),
  body("url_demo").optional({ nullable: true }).isString().trim(),
  body("url_github").optional({ nullable: true }).isString().trim(),
  body("under_development").isBoolean(),
  body("status").isString().notEmpty().escape().trim(),
];

export const updateProjectSchema = [
  param("uuid").isString().notEmpty().escape().trim(),
  body("title").isString().notEmpty().escape().trim(),
  body("description").isString().notEmpty().escape().trim(),
  body("url_cover").isString().notEmpty().trim(),
  body("technologies").isArray().notEmpty(),
  body("slug").isString().notEmpty().escape().trim(),
  body("url_demo").optional().isString().trim(),
  body("url_github").optional().isString().trim(),
  body("under_development").isBoolean(),
  body("status").isString().notEmpty().escape().trim(),
];

export const paramsProjectSchema = [
  param("uuid").isString().notEmpty().escape().trim(),
];

export const paramsTitleSchema = [
  param("title").isString().notEmpty().escape().trim(),
];
