import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";

const leaderboardRoutes = express.Router();

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Retrieve leaderboard user list
 *     tags: [Leaderboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard list fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
leaderboardRoutes.get("/", authMiddleware, getLeaderboard);

export default leaderboardRoutes;
