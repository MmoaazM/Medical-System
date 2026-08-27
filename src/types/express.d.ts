import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id?: string;
        id?: string;
        FullName?: string;
        Email?: string;
        Role?: "Patient" | "Doctor" | "Admin" | string;
        role?: "Patient" | "Doctor" | "Admin" | string;
        [key: string]: any;
      };
      User?: any;
    }
  }
}
