import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function getExpiresInSeconds(expiresInEnv: string | undefined): number {
    if (!expiresInEnv) return 86400; // 24 hours default
    if (/^\d+$/.test(expiresInEnv)) return parseInt(expiresInEnv, 10);
    const match = expiresInEnv.match(/^(\d+)([smhd])$/);
    if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
            case "s": return value;
            case "m": return value * 60;
            case "h": return value * 3600;
            case "d": return value * 86400;
        }
    }
    return 86400;
}

const expiresInSec = getExpiresInSeconds(process.env.JWT_EXPIRES_IN);

const createToken = (id: string, role: string, fullName: string, email: string) => {
    return jwt.sign(
        { id, _id: id, Role: role, role, FullName: fullName, Email: email },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: expiresInSec }
    );
};

export async function register(req: Request, res: Response) {
    try {
        const FullName = req.body.FullName || req.body.fullName;
        const Email = req.body.Email || req.body.email;
        const password = req.body.Password || req.body.password;
        const Role = req.body.Role || req.body.role;

        if (!FullName || !Email || !password || !Role) {
            return res.status(400).json({ message: "FullName, Email, Password, and Role are required" });
        }

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            FullName,
            Email,
            Password: hashedPassword,
            Role,
        });

        const token = createToken(user._id.toString(), user.Role, user.FullName, user.Email);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: expiresInSec * 1000,
        });

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                _id: user._id,
                FullName: user.FullName,
                Email: user.Email,
                Role: user.Role,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Server error during registration" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const Email = req.body.Email || req.body.email;
        const Password = req.body.Password || req.body.password;

        if (!Email || !Password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const currentUser = await User.findOne({ Email });
        if (!currentUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(Password, currentUser.Password);
        if (!match) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = createToken(currentUser._id.toString(), currentUser.Role, currentUser.FullName, currentUser.Email);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: expiresInSec * 1000,
        });

        return res.status(200).json({
            message: "Logged in successfully",
            token,
            user: {
                id: currentUser._id,
                _id: currentUser._id,
                FullName: currentUser.FullName,
                Email: currentUser.Email,
                Role: currentUser.Role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
}