import express from "express";
import dotenv from "dotenv";
import cokieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problems.routes.js";
import executionRoutes from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

const app = express();

const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cokieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.get("/", (req, res) => {
  res.send("Hello guys welcome to LeetLab! 🔥");
});

app.listen(port, () => {
  console.log(`Test server is running at http://localhost:${port}`);
});
