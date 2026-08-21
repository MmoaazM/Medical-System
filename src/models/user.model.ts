import { Schema, model } from "mongoose";

export type UserRole = "Patient" | "Doctor" | "Admin";

const userSchema = new Schema({
  
});

export default model("User", userSchema);