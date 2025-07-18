import express from "express";
import {
  changePassword,
  check,
  login,
  logout,
  register,
  requestOtpForRegistration, 
  verifyOtpAndRegister,     
  requestPasswordResetOtp, 
  resetPasswordWithOtp, 
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.get("/check", authMiddleware, check);

authRoutes.post("/change-password", authMiddleware, changePassword);

// New OTP related routes
authRoutes.post("/request-otp-register", requestOtpForRegistration);
authRoutes.post("/verify-otp-register", verifyOtpAndRegister);
authRoutes.post("/request-password-reset-otp", requestPasswordResetOtp);
authRoutes.post("/reset-password-with-otp", resetPasswordWithOtp);


export default authRoutes;
