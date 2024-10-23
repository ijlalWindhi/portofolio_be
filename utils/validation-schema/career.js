import { body, param } from "express-validator";

export const createCareerSchema = [
  body("position").isString().notEmpty().escape().trim(),
  body("company").isString().notEmpty().escape().trim(),
  body("logo").isString().notEmpty().trim(),
  body("location").isString().notEmpty().escape().trim(),
  body("location_type").isString().notEmpty().escape().trim(),
  body("type").isString().notEmpty().escape().trim(),
  body("start_date").isString().notEmpty().trim(),
  body("end_date").optional({ nullable: true }).isString().trim(),
  body("link").isString().notEmpty().trim(),
];

export const updateCareerSchema = [
  param("uuid").isString().notEmpty().escape().trim(),
  body("position").isString().notEmpty().escape().trim(),
  body("company").isString().notEmpty().escape().trim(),
  body("logo").isString().notEmpty().trim(),
  body("location").isString().notEmpty().escape().trim(),
  body("location_type").isString().notEmpty().escape().trim(),
  body("type").isString().notEmpty().escape().trim(),
  body("start_date").isString().notEmpty().trim(),
  body("end_date").optional({ nullable: true }).isString().trim(),
  body("link").isString().notEmpty().trim(),
];

export const paramsCareerSchema = [
  param("uuid").isString().notEmpty().escape().trim(),
];
