import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problems.routes.js";
import executionRoutes from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import cors from "cors";
import healthcheckRoutes from "./routes/healthcheck.routes.js";
import axios from "axios";

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

app.get("/", (req, res) => {
  res.send("Hello guys welcome to LeetLab! 🔥");
});

app.listen(port, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    return;
  }
  console.log("server started at port for leetlab", process.env.PORT);
});

// Add error handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

const keepAlive = () => {
  setInterval(async () => {
    try {
      const res = await axios.get(
        "https://leetlab-azp5.onrender.com/api/v1/health-check",
        {
          timeout: 4000,
        }
      );
      console.log("✅ Ping successful:", res.status);
    } catch (error) {
      console.warn("⚠️ Ping failed:", error);
    }
  }, 1000 * 60 * 10); // every 10 minutes
};

keepAlive();
