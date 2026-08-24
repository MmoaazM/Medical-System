import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

export async function register(req: Request, res: Response) {
    try {
        const { id, fullName, email, password, role } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({
            id,
            fullName,
            email,
            password: hashedPassword,
            role,
        });
        
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                fullName: user.name,
                email: user.email,
        role: user.role,
    },
    });
} catch (error) {
    return res.status(500).json({
        message: "Server error",
    });
}
};

export async function login(req: Request, res: Response) {

}