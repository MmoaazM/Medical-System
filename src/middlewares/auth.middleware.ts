import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
export function authGuard(req: Request, res: Response, next: NextFunction) {
      

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).User = decode;
        next()
    }


    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });

    }
}
