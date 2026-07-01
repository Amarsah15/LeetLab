import { z } from "zod";

// Validation schemas
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const registerOtpSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const verifyOtpRegisterSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, "OTP must be 6 digits"),
});

export const requestPasswordResetSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format")
      .trim()
      .toLowerCase(),
    otp: z
      .string({ required_error: "OTP is required" })
      .length(6, "OTP must be 6 digits"),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format")
      .trim()
      .toLowerCase(),
    otp: z
      .string({ required_error: "OTP is required" })
      .length(6, "OTP must be 6 digits"),
    oldPassword: z
      .string({ required_error: "Old password is required" })
      .min(1, "Old password is required"),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password.",
    path: ["newPassword"],
  });

// Middleware factory — validates req.body against a Zod schema
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return res.status(400).json({ error: firstError.message });
  }
  req.body = result.data; // Use parsed & sanitized data
  next();
};
