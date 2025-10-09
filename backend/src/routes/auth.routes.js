import express from "express";
import {
  check,
  login,
  logout,
  requestOtpForRegistration,
  verifyOtpAndRegister,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/login", login);

authRoutes.post("/request-otp-register", requestOtpForRegistration);

authRoutes.post("/verify-otp-register", verifyOtpAndRegister);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.get("/check", authMiddleware, check);

authRoutes.post("/request-password-reset-otp", requestPasswordResetOtp);

authRoutes.post(
  "/reset-password-with-otp",
  authMiddleware,
  resetPasswordWithOtp
);

export default authRoutes;
