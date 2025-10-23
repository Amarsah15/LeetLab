import express from "express";
import {
  analyzeComplexity,
  getHint,
  getImprovementSuggestions,
} from "../controllers/ai.controller.js";

const aiRoutes = express.Router();

aiRoutes.post("/analyze-complexity", analyzeComplexity);
aiRoutes.post("/get-hint", getHint);
aiRoutes.post("/get-improvements", getImprovementSuggestions);

export default aiRoutes;
