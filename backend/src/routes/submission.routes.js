import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getAllSubmission,
  getAllTheSubmissionForProblem,
  getSubmissionForProblem,
} from "../controllers/submission.controleers.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submission", authMiddleware, getAllSubmission);

submissionRoutes.get(
  "/get-submission/:problemId    ",
  authMiddleware,
  getSubmissionForProblem
);

submissionRoutes.get(
  "/get-submission-count/:problemId",
  authMiddleware,
  getAllTheSubmissionForProblem
);

export default submissionRoutes;
