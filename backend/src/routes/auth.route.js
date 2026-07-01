import express from "express";
import {
  check,
  login,
  logout,
  requestOtpForRegistration,
  verifyOtpAndRegister,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  resetPasswordUnauthenticated,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validate,
  loginSchema,
  registerOtpSchema,
  verifyOtpRegisterSchema,
  requestPasswordResetSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "../middlewares/validation.middleware.js";

import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const authRoutes = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials / User not found
 *       500:
 *         description: Server error
 */
authRoutes.post("/login", authLimiter, validate(loginSchema), login);

/**
 * @swagger
 * /auth/request-otp-register:
 *   post:
 *     summary: Request OTP email for registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: User already exists / Invalid fields
 *       500:
 *         description: Server error
 */
authRoutes.post(
  "/request-otp-register",
  authLimiter,
  validate(registerOtpSchema),
  requestOtpForRegistration,
);

/**
 * @swagger
 * /auth/verify-otp-register:
 *   post:
 *     summary: Verify registration OTP and create user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - otp
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account registered successfully
 *       400:
 *         description: Invalid or expired OTP / User already exists
 *       500:
 *         description: Server error
 */
authRoutes.post(
  "/verify-otp-register",
  authLimiter,
  validate(verifyOtpRegisterSchema),
  verifyOtpAndRegister,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Clear JWT cookie to log out user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
authRoutes.post("/logout", authMiddleware, logout);

/**
 * @swagger
 * /auth/check:
 *   get:
 *     summary: Verify session cookie token and retrieve user profile
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized / User not found
 *       500:
 *         description: Server error
 */
authRoutes.get("/check", authMiddleware, check);

/**
 * @swagger
 * /auth/request-password-reset-otp:
 *   post:
 *     summary: Request OTP email for password reset (Forgot Password)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent successfully or email handled silently
 *       500:
 *         description: Server error
 */
authRoutes.post(
  "/request-password-reset-otp",
  authLimiter,
  validate(requestPasswordResetSchema),
  requestPasswordResetOtp,
);

/**
 * @swagger
 * /auth/reset-password-with-otp:
 *   post:
 *     summary: Change password using reset OTP (Authenticated)
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid or expired OTP
 *       401:
 *         description: Old password is incorrect / Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
authRoutes.post(
  "/reset-password-with-otp",
  authMiddleware,
  validate(changePasswordSchema),
  resetPasswordWithOtp,
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Reset password without session login (Forgot Password flow)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
authRoutes.post(
  "/forgot-password",
  authLimiter,
  validate(resetPasswordSchema),
  resetPasswordUnauthenticated,
);

export default authRoutes;
