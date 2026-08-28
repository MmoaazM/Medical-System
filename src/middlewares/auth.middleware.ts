/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";



export function authGuard(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const normalizedUser = {
            id: decoded.id || decoded._id,
            _id: decoded.id || decoded._id,
            FullName: decoded.FullName || decoded.fullName,
            Email: decoded.Email || decoded.email,
            Role: decoded.Role || decoded.role,
            role: decoded.Role || decoded.role,
        };
        req.user = normalizedUser;
        req.User = normalizedUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

