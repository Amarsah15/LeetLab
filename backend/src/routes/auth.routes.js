import express from "express";
import {
  check,
  forgetPassword,
  login,
  logout,
  register,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.get("/check", authMiddleware, check);

authRoutes.post("/forgot-password", authMiddleware, forgetPassword);


export default authRoutes;
