import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { sendEmail } from "../libs/sendEmail.js";
import { generateOTP } from "../libs/otpGenerator.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

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

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
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
    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        _id: req.user._id,
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

export const requestOtpForRegistration = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true },
    );

    await sendEmail(
      email,
      "LeetLab Registration OTP",
      `Your OTP for LeetLab registration is: ${otp}. It is valid for 10 minutes.`,
      `<p>Your OTP for LeetLab registration is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
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
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const storedOtp = await Otp.findOne({ email });
    if (!storedOtp) {
      return res
        .status(400)
        .json({ error: "OTP not found. Please request a new one." });
    }

    const isOtpExpired = new Date() > storedOtp.expiresAt;
    const isOtpInvalid = storedOtp.otp !== otp;

    if (isOtpInvalid || isOtpExpired) {
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

    sendEmail(
      email,
      "🎉 Welcome to LeetLab — Let's Get Started!",
      `Hi ${name},\n\nYour registration was successful! We're thrilled to have you join LeetLab.\n\n${process.env.CLIENT_URL}\n\nHappy coding!\n— The LeetLab Team`,
      `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>🎉 Welcome to LeetLab!</h2>
        <p>Hi ${name},</p>
        <p>Your registration was successful! We're thrilled to have you join <strong>LeetLab</strong>.</p>
        <p style="margin-top: 20px;">
          <a href="${process.env.CLIENT_URL}" style="background-color: #4f46e5; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            🔗 Log in to Your Account
          </a>
        </p>
        <p style="margin-top: 30px;">Happy coding!<br>— The LeetLab Team</p>
      </div>`,
    ).catch((err) => console.error("Email send failed:", err.message));

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

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, an OTP has been sent.",
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true },
    );

    await sendEmail(
      email,
      "LeetLab Password Reset OTP",
      `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      `<p>Your OTP for password reset is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
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
  const { email, otp, oldPassword, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "New password must be different from old password." });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match." });
  }

  try {
    const storedOtp = await Otp.findOne({ email });

    if (
      !storedOtp ||
      storedOtp.otp !== otp ||
      new Date() > storedOtp.expiresAt
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await Otp.deleteOne({ email });

    await sendEmail(
      email,
      "🔒 LeetLab Password Reset Successful",
      `Hi there,\n\nYour LeetLab account password has been reset successfully.\n\n— The LeetLab Team`,
      `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #4f46e5;">🔒 Password Reset Successful</h2>
    <p>Hi there,</p>
    <p>Your <strong>LeetLab</strong> account password has been reset successfully.</p>
    <p>Stay secure,<br>— The <strong>LeetLab</strong> Team</p>
  </div>`,
    );

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password with OTP:", error);
    res
      .status(500)
      .json({ error: "Internal server error during password reset" });
  }
};
