import { Request, Response, NextFunction } from "express";

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user || req.User;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User context missing" });
    }

    const userRole = user.Role || user.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Access denied for this role" });
    }

    next();
  };
}

