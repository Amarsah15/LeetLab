import express from "express";
import {
  changePassword,
  check,
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

authRoutes.post("/change-password", authMiddleware, changePassword);


export default authRoutes;
