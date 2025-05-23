import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controllers.js";

const executionRoute = express.Router();

executionRoute.post("/", authMiddleware, executeCode);

export default executionRoute;
