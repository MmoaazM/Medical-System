import mongoose, { Schema, Document , model} from 'mongoose';

export type UserRole = "Patient" | "Doctor" | "Admin";
export interface User extends Document {
    id:string,
    name:string,
    email:string,
    password:string,
    role: UserRole,
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default model("User", userSchema);