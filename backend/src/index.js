import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connectDB } from "./libs/db.js";
import {
  globalLimiter,
  authLimiter,
  aiLimiter,
  executionLimiter,
} from "./middlewares/rateLimit.middleware.js";

// Importing routes
import authRoutes from "./routes/auth.route.js";
import problemRoutes from "./routes/problems.route.js";
import executionRoutes from "./routes/executeCode.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import healthcheckRoutes from "./routes/healthcheck.route.js";
import aiRoutes from "./routes/ai.route.js";
import discussionRoutes from "./routes/discussion.route.js";
import leaderboardRoutes from "./routes/leaderboard.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./libs/swagger.config.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Security headers
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://leetlab-rho.vercel.app",
      "https://leet-lab-amarnath-kumar.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(globalLimiter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionLimiter, executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/health-check", healthcheckRoutes);
app.use("/health-check", healthcheckRoutes);
app.use("/api/v1/ai", aiLimiter, aiRoutes);
app.use("/api/v1/discussions", discussionRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// Swagger Documentation API UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello guys welcome to LeetLab! 🔥");
});

let server;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, (err) => {
    if (err) {
      console.error("Failed to start server:", err);
      return;
    }
    console.log("Server started at port for leetlab", process.env.PORT);
    connectDB().catch((err) => {
      console.error("Delayed MongoDB connection error:", err);
    });
  });
}

export { server };
export default app;
