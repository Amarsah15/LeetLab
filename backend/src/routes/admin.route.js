import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import { getAnalytics } from "../controllers/admin.controller.js";

const adminRoutes = express.Router();

adminRoutes.get("/analytics", authMiddleware, checkAdmin, getAnalytics);

export default adminRoutes;
