import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { syncUserStreak } from "../libs/streak.js";
import Otp from "../models/otp.model.js";
import { generateOTP } from "../libs/otpGenerator.js";
import {
  sendRegistrationOtpMail,
  sendPasswordResetOtpMail,
  sendPasswordChangedConfirmationMail,
  sendWelcomeMail,
} from "../libs/emailService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const syncedUser = await syncUserStreak(user._id);
    const finalUser = syncedUser || user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: finalUser._id,
        name: finalUser.name,
        email: finalUser.email,
        role: finalUser.role,
        image: finalUser.image,
        currentStreak: finalUser.currentStreak,
        maxStreak: finalUser.maxStreak,
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
      secure: true,
      sameSite: "None",
      path: "/",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ error: "Internal server error in Logout" });
  }
};

export const check = async (req, res) => {
  try {
    const syncedUser = await syncUserStreak(req.user._id);
    const finalUser = syncedUser || req.user;

    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        _id: finalUser._id,
        name: finalUser.name,
        email: finalUser.email,
        role: finalUser.role,
        image: finalUser.image,
        currentStreak: finalUser.currentStreak,
        maxStreak: finalUser.maxStreak,
      },
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const requestOtpForRegistration = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt },
      { upsert: true, new: true },
    );

    await sendRegistrationOtpMail(email, otp);

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
  try {
    const { name, email, password, otp } = req.body;

    const storedOtp = await Otp.findOne({ email });
    if (!storedOtp) {
      return res
        .status(400)
        .json({ error: "OTP not found. Please request a new one." });
    }

    const isOtpExpired = new Date() > storedOtp.expiresAt;
    const isOtpValid = await bcrypt.compare(otp, storedOtp.otp);

    if (!isOtpValid || isOtpExpired) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
    });

    await Otp.deleteOne({ email });

    sendWelcomeMail(email, name).catch((err) =>
      console.error("Email send failed:", err.message),
    );

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
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
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
        currentStreak: newUser.currentStreak,
        maxStreak: newUser.maxStreak,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP and registering user:", error);
    return res.status(500).json({
      error: "Internal server error during OTP verification and registration",
    });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, an OTP has been sent.",
      });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt },
      { upsert: true, new: true },
    );

    await sendPasswordResetOtpMail(email, otp);

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
  const { email, otp, oldPassword, newPassword } = req.body;

  try {
    const storedOtp = await Otp.findOne({ email });

    if (!storedOtp || new Date() > storedOtp.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const isOtpValid = await bcrypt.compare(otp, storedOtp.otp);
    if (!isOtpValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteOne({ email });

    await sendPasswordChangedConfirmationMail(email, false);

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("Error resetting password with OTP:", error);
    res
      .status(500)
      .json({ error: "Internal server error during password change" });
  }
};

// Unauthenticated password reset — true "forgot password" flow (no login required)
export const resetPasswordUnauthenticated = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const storedOtp = await Otp.findOne({ email });

    if (!storedOtp || new Date() > storedOtp.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const isOtpValid = await bcrypt.compare(otp, storedOtp.otp);
    if (!isOtpValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteOne({ email });

    await sendPasswordChangedConfirmationMail(email, true);

    res
      .status(200)
      .json({
        success: true,
        message:
          "Password reset successfully. Please log in with your new password.",
      });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "Internal server error during password reset" });
  }
};
