import express from "express";
import mongoose from "mongoose";

const healthcheckRoutes = express.Router();

healthcheckRoutes.get("/", async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const isDbConnected = dbStatus === 1;
  let dbPingTime = null;

  if (isDbConnected) {
    try {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();
      dbPingTime = `${Date.now() - start}ms`;
    } catch (err) {
      return res.status(500).json({
        status: "unhealthy",
        database: {
          status: "connected_but_failing",
          error: err.message,
        },
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  const statusCode = isDbConnected ? 200 : 500;
  res.status(statusCode).json({
    status: isDbConnected ? "healthy" : "unhealthy",
    database: {
      status: statusMap[dbStatus] || "unknown",
      ping: dbPingTime,
    },
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

export default healthcheckRoutes;
