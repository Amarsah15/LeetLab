import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  uploadProfileImage,
  removeProfileImage,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

/**
 * @swagger
 * /user/profile-image:
 *   put:
 *     summary: Upload or update user profile avatar image
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRoutes.put(
  "/profile-image",
  authMiddleware,
  upload.single("image"),
  uploadProfileImage,
);

/**
 * @swagger
 * /user/profile-image:
 *   delete:
 *     summary: Remove profile avatar image
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile image removed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
userRoutes.delete("/profile-image", authMiddleware, removeProfileImage);

export default userRoutes;
