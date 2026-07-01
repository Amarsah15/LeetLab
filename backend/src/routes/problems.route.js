import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  updateProblem,
  getDailyChallenge,
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

/**
 * @swagger
 * /problems/create-problem:
 *   post:
 *     summary: Create a new problem (Admin only)
 *     tags: [Problems]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - difficulty
 *               - constraints
 *               - examples
 *               - testCases
 *               - codeSnippets
 *               - referenceSolutions
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [EASY, MEDIUM, HARD]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               constraints:
 *                 type: string
 *               examples:
 *                 type: object
 *               testCases:
 *                 type: object
 *               codeSnippets:
 *                 type: object
 *               referenceSolutions:
 *                 type: object
 *     responses:
 *       201:
 *         description: Problem created successfully
 *       400:
 *         description: Test cases validation failed
 *       403:
 *         description: Forbidden - Requires Admin role
 *       500:
 *         description: Server error
 */
problemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem,
);

/**
 * @swagger
 * /problems/get-all-problems:
 *   get:
 *     summary: Get all problems loaded in the database
 *     tags: [Problems]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of problems retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);
problemRoutes.get("/daily-challenge", authMiddleware, getDailyChallenge);

/**
 * @swagger
 * /problems/get-problem/{id}:
 *   get:
 *     summary: Retrieve a single problem by database ID
 *     tags: [Problems]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Database ID of the problem
 *     responses:
 *       200:
 *         description: Problem details retrieved successfully
 *       404:
 *         description: Problem not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

/**
 * @swagger
 * /problems/update-problem/{id}:
 *   put:
 *     summary: Update an existing problem details (Admin only)
 *     tags: [Problems]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Database ID of the problem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Problem updated successfully
 *       400:
 *         description: Test cases validation failed
 *       403:
 *         description: Forbidden - Requires Admin role
 *       404:
 *         description: Problem not found
 *       500:
 *         description: Server error
 */
problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem,
);

/**
 * @swagger
 * /problems/delete-problem/{id}:
 *   delete:
 *     summary: Delete a problem from database (Admin only)
 *     tags: [Problems]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Database ID of the problem to delete
 *     responses:
 *       200:
 *         description: Problem deleted successfully
 *       403:
 *         description: Forbidden - Requires Admin role
 *       404:
 *         description: Problem not found
 *       500:
 *         description: Server error
 */
problemRoutes.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem,
);

/**
 * @swagger
 * /problems/get-solved-problems:
 *   get:
 *     summary: Get all problems solved by the authenticated user
 *     tags: [Problems]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of solved problems retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
problemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemsSolvedByUser,
);

export default problemRoutes;
