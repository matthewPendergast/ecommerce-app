import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateSignup = [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Email is invalid.").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters longs.")
];

export const validateLogin = [
    body("email").isEmail().withMessage("Email is invalid.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required.")
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};