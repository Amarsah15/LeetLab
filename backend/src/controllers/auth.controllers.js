import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import { sendEmail } from "../libs/sendEmail.js";
import { generateOTP } from "../libs/otpGenerator.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER, // Default role
      },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true, // ✅ always true in Render (HTTPS)
      sameSite: "None", // ✅ necessary for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      error: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true, // ✅ always true in Render (HTTPS)
      sameSite: "None", // ✅ necessary for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    return res
      .status(204)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ error: "Internal server error in Logout" });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image,
      },
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(401)
        .json({ message: "Password and Confirm password are not match." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
    return res.status(200).json({
      message: "Password updated successfully.  Login with new password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating password" });
  }
};

export const requestOtpForRegistration = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Store OTP in the database, overwriting if one already exists for this email
    await db.otp.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    await sendEmail(
      email,
      "LeetLab Registration OTP",
      `Your OTP for LeetLab registration is: ${otp}. It is valid for 10 minutes.`,
      `<p>Your OTP for LeetLab registration is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your email for registration.",
    });
  } catch (error) {
    console.error("Error requesting OTP for registration:", error);
    res.status(500).json({ error: "Failed to send OTP for registration" });
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  const { name, email, password, otp } = req.body;

  if (!name || !email || !password || !otp) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const storedOtp = await db.otp.findUnique({
      where: { email },
    });

    if (!storedOtp || storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // OTP is valid, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    // Delete the OTP after successful registration
    await db.otp.delete({ where: { email } });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP and registering user:", error);
    res.status(500).json({ error: "Internal server error during registration" });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if the user exists or not
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, an OTP has been sent.",
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    await db.otp.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    await sendEmail(
      email,
      "LeetLab Password Reset OTP",
      `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      `<p>Your OTP for password reset is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your email for password reset.",
    });
  } catch (error) {
    console.error("Error requesting password reset OTP:", error);
    res.status(500).json({ error: "Failed to send password reset OTP" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match." });
  }

  try {
    const storedOtp = await db.otp.findUnique({
      where: { email },
    });

    if (!storedOtp || storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete the OTP after successful password reset
    await db.otp.delete({ where: { email } });

    res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password with OTP:", error);
    res.status(500).json({ error: "Internal server error during password reset" });
  }
};