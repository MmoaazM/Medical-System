import { Schema, model, Types } from "mongoose";

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

const appointmentSchema = new Schema({
  
});

export default model("Appointment", appointmentSchema);