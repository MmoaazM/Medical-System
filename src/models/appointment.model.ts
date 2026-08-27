import { Schema, model, InferSchemaType, HydratedDocumentFromSchema } from "mongoose";

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

const appointmentSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    schedule:{
        type:Schema.Types.ObjectId,
        ref:"Schedule",
        required:true
    },
    appointmentDate: {
        type: String,
        required: true
    },
    timeSlot: {
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"] as const,
        default: "Pending"
    },
    notes: {
        type: String,
        trim: true,
    }
}
);

appointmentSchema.index(
    { doctor: 1, appointmentDate: 1, "timeSlot.startTime": 1 },
    { unique: true }
);


export type IAppointment = InferSchemaType<typeof appointmentSchema>;
export type AppointmentDocument = HydratedDocumentFromSchema<typeof appointmentSchema>;

export default model("Appointment", appointmentSchema);