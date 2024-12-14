import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin","brand"], 
      default: "user",
    },
    profilepic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Export the User model based on the schema
export const User = mongoose.model("User", userSchema);
