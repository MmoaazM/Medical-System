import mongoose, { Schema, Document , model} from 'mongoose';

export type UserRole = "Patient" | "Doctor" | "Admin";
export interface User extends Document {
    name:string,
    email:string,
    password:string,
    role: UserRole,
}

const userSchema = new Schema({
  FullName: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: true,
    unique: true,
  },

  Password: {
    type: String,
    required: true,
  },
  
  Role: {
    type: String,
    enum: ["Patient", "Doctor", "Admin"],
    required: true,
  },
});

export default model("User", userSchema);