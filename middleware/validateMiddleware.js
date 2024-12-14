import { body, validationResult } from "express-validator";
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  NotFoundError,
} from "../errors/customErrors.js";
import { User } from "../model/user.Model.js";

// Middleware for Handling Validation Errors
export const withvalidationError = (validatevalue) => {
  return [
    validatevalue,
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        const errorMessage = error.array().map((error) => error.msg);
        if (errorMessage[0].startsWith("not Unauthorized")) {
          throw new UnauthorizedError("not Unauthorized to access this route");
        }
        throw new BadRequestError(errorMessage);
      }
      next();
    },
  ];
};

// Validation for Register Input
export const validateRegisterinput = withvalidationError([
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      if (!email) {
        throw new Error("Email is required");
      }
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
]);

export const validateBrandInput = withvalidationError([
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      if (!email) {
        throw new Error("Email is required");
      }
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body('brandname').trim().notEmpty().withMessage('brandname is reqiured').isLength({min:3}).withMessage('please provided valid brand name')
]);

//validate login input
export const validateLoginInput = withvalidationError([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);
