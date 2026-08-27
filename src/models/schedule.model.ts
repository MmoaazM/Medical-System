import { Schema, model, Types } from "mongoose";
import { availableMemory } from "process";

const scheduleSchema = new Schema({
    doctor:{
        type: Types.ObjectId,
        ref: "DoctorProfile",
        required: true,
    },
    day:{
        type: String,
        required: true,
    },
    availableTimeSlots:{
        type: [String],
        required: true,
    },
    availability:{
        type: Boolean,
        required: true,
    },
});

export default model("Schedules", scheduleSchema); 