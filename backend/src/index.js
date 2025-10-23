import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Importing routes
import authRoutes from "./routes/auth.route.js";
import problemRoutes from "./routes/problems.route.js";
import executionRoutes from "./routes/executeCode.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import healthcheckRoutes from "./routes/healthcheck.route.js";
import aiRoutes from "./routes/ai.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://leetlab-rho.vercel.app",
      "https://leetlab-azp5.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/health-check", healthcheckRoutes);
app.use("/api/v1/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Hello guys welcome to LeetLab! 🔥");
});

app.listen(port, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    return;
  }
  console.log("Server started at port for leetlab", process.env.PORT);
});
