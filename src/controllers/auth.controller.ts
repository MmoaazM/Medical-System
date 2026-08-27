import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
export async function register(req: Request, res: Response) {

    const { FullName, Email, Password, Role } = req.body;

    try {
        const user = await User.create({ FullName, Email, Password, Role })



        const token = jwt.sign(

            { id: user._id, role: user.Role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }

        );
        return res.status(201).json({ message: "User registered", token, user });
    } 
    
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

export async function login(req: Request, res: Response) {
try{
const {Email,Password}=req.body;

const user=await User.findOne({Email});
if(!user)
{
    return res.status(404).json({ message: "User not found" }); 
}

if(user.Password !== Password)
{
return res.status(401).json({ message: "Invalid   password" });
}
const token = jwt.sign(
      { id: user._id, role: user.Role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ message: "Logged in successfully", token, user });
}
catch(error){

return res.status(500).json({ message: "Server error", error });
}

}
