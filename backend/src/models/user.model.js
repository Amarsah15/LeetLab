import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    image: { type: String, default: null },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    currentStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;
