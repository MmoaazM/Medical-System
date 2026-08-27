import { Schema, model, Types } from "mongoose";
import { validateTimeSlots } from "../middlewares/validations.middleware";
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

    availableTimeSlots: [{
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        },
        available: {
            type: Boolean,
            default: true
        },
        validate: {
        validator: validateTimeSlots,
        message: "Invalid working hours"
        }
    }],
    
    availability:{
        type: Boolean,
        required: true,
    },
});

export default model("Schedules", scheduleSchema); 
