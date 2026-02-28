import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  availableDays: {
    type: [String],
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  },
  consultationFee: {
    type: Number,
    required: true
  },
  bio: {
    type: String
  },
  languages: [String],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema);
