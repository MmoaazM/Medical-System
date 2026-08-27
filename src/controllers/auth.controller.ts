import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";


export async function register(req: Request, res: Response) {
    try {
        const { id, FullName, Email, password, Role } = req.body;
        
        // Check if Email already exists
        const existingUser = await User.findOne({ Email });
        
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
            FullName,
            Email,
            password: hashedPassword,
            Role,
        });
        
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                FullName: user.FullName,
                Email: user.Email,
        Role: user.Role,
    },
    });
} catch (error) {
    return res.status(500).json({
        message: "Server error",
    });
}
};

const maxAge = process.env.JWT_EXPIRES_IN as any ;
const createToken = (id: string , role: string) => {
    return jwt.sign({id,role} , process.env.JWT_SECRET as string , {expiresIn : maxAge }) ;
};

export async function login(req: Request, res: Response) {
    try{
        const { Email, Password } = req.body;

        const currentUser = await User.findOne({ Email });

        if(!currentUser){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const match = await bcrypt.compare( Password , currentUser.Password);

        if(!match){
            return res.status(400).json({ message: "Invalid email or password" }) ;
        }

        const token = createToken( currentUser.id , currentUser.Role );

        res.cookie( "token" , token , {
            httpOnly: true ,
            maxAge : maxAge*1000 ,
        });

        res.status(200).json({ message: "Logged in "})

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};