import { Schema, model, Types } from "mongoose";

const doctorProfileSchema = new Schema({
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialty: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    clinicAddress: {
      type: String,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    workingHours: {
      type: String,
      required: true,
    },

    availabilityStatus: {
      type: Boolean,
      default: true,
    },
});

export default model("Doctors", doctorProfileSchema);