import { Schema, model } from "mongoose";

export type UserRole = "Patient" | "Doctor" | "Admin";


const userSchema = new Schema({

    FullName:String,
    Email:String,
    Password:String,
    Role: {
    type: String,
    enum: ["Patient", "Doctor", "Admin"],
    required: true,
  }
});

export default model("User", userSchema);