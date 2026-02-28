import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [8, "Username cannot exceed 8 characters"],
      trim: true,
      unique: true, // Username bhi unique hona chahiye aksar
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Please enter a valid email"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["doctor", "patient", "receptionist","admin"], // Sirf yahi roles allow honge
      default: "patient",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // select: false, // Isse query karte waqt password apne aap nahi aayega (Security)
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);