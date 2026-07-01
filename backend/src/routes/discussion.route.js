import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getDiscussions,
  createDiscussion,
  deleteDiscussion,
  toggleUpvote,
  updateDiscussion,
} from "../controllers/discussion.controller.js";

const discussionRoutes = express.Router();

discussionRoutes.get("/:problemId", authMiddleware, getDiscussions);
discussionRoutes.post("/:problemId", authMiddleware, createDiscussion);
discussionRoutes.put("/:discussionId", authMiddleware, updateDiscussion);
discussionRoutes.delete("/:discussionId", authMiddleware, deleteDiscussion);
discussionRoutes.post("/:discussionId/upvote", authMiddleware, toggleUpvote);

export default discussionRoutes;
