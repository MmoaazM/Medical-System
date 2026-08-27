import { Request, Response, NextFunction } from "express";

//Custom application error class to handle operational errors with status codes
export class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
    public errors?: any;

    constructor(message: string, statusCode: number = 500, errors?: any) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

//Global Express Error Handling Middleware
export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors;

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
        errors = Object.values(err.errors || {}).map((item: any) => item.message);
    }

    // Mongoose CastError
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid format for field '${err.path}': ${err.value}`;
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;
        const duplicateFields = Object.keys(err.keyValue || {});
        const fieldName = duplicateFields.length > 0 ? duplicateFields.join(", ") : "field";
        message = `Duplicate value entered for '${fieldName}'. Please use a unique value.`;
    }

    // JWT Errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authentication token. Please log in again.";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authentication token has expired. Please log in again.";
    }

    // Malformed JSON Body
    if (err instanceof SyntaxError && "body" in err) {
        statusCode = 400;
        message = "Malformed JSON payload in request body.";
    }

    // Log error in console
    console.error(`[Error] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${message}`);
    if (process.env.NODE_ENV === "development" && err.stack) {
        console.error(err.stack);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors ? { errors } : {}),
        ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    });
}