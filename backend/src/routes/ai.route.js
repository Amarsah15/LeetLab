import express from "express";
import {
  analyzeComplexity,
  getHint,
  getImprovementSuggestions,
} from "../controllers/ai.controller.js";

const aiRoutes = express.Router();

/**
 * @swagger
 * /ai/analyze-complexity:
 *   post:
 *     summary: Analyze space and time complexity of provided code snippet
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - language
 *             properties:
 *               code:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Complexity analysis completed successfully
 *       500:
 *         description: Server error
 */
aiRoutes.post("/analyze-complexity", analyzeComplexity);

/**
 * @swagger
 * /ai/get-hint:
 *   post:
 *     summary: Request a hint for a problem description based on user code
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - problemDescription
 *               - language
 *             properties:
 *               code:
 *                 type: string
 *               problemDescription:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hint generated successfully
 *       500:
 *         description: Server error
 */
aiRoutes.post("/get-hint", getHint);

/**
 * @swagger
 * /ai/get-improvements:
 *   post:
 *     summary: Retrieve design/logic improvement suggestions for code snippet
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - problemDescription
 *               - language
 *             properties:
 *               code:
 *                 type: string
 *               problemDescription:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Improvement suggestions generated successfully
 *       500:
 *         description: Server error
 */
aiRoutes.post("/get-improvements", getImprovementSuggestions);

export default aiRoutes;
