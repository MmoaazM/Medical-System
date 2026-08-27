import { Request, Response, NextFunction } from "express";

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
   if(!(req as any).User)
   {
    return res.status(401).json({ message: "Unauthorized" }); 
   }

   if (!roles.includes((req as any).User.Role)) {
  return res.status(403).json({ message: "Forbidden" });
  };
  
  next();
}
}
