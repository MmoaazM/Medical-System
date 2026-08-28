import { Schema, model, Types } from "mongoose";
import { validateTimeSlots } from "../middlewares/validations.middleware";

const scheduleSchema = new Schema({
    doctor: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    
    day: {
        type: String,
        required: true,
    },

    availableTimeSlots: {
        type: [{
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
            }
        }],
        validate: {
            validator: validateTimeSlots,
            message: "Invalid working hours"
        }
    },
    
    availability: {
        type: Boolean,
        default: true,
    },
});

export default model("Schedules", scheduleSchema);
