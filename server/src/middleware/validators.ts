import { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';

// Middleware to handle validation results
export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

// Validator for user registration
export const userRegistrationValidator:RequestHandler[] = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validate
];

// Validator for user login
export const userLoginValidator = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validate
];

// Validator for property creation
export const propertyCreationValidator = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ min: 5 })
        .withMessage('Title must be at least 5 characters long'),
    body('description')
        .isString()
        .withMessage('Description must be a string')
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a positive number'),
    body('location')
        .isString()
        .withMessage('Location must be a string'),
    validate
];