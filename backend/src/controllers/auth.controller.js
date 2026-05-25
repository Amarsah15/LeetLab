import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { sendEmail } from "../libs/sendEmail.js";
import { generateOTP } from "../libs/otpGenerator.js";

const year = new Date().getFullYear();

const emailHeader = `
  <div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:32px 40px 24px;text-align:center">
    <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:8px">
      <div style="width:32px;height:32px;background:#4f46e5;border-radius:8px;display:inline-flex;align-items:center;justify-content:center">
        <span style="color:#fff;font-size:14px;font-weight:700">&lt;/&gt;</span>
      </div>
      <span style="color:#fff;font-size:20px;font-weight:700">LeetLab</span>
    </div>
`;

const emailFooter = `
  <div style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:16px 40px;text-align:center">
    <p style="font-size:12px;color:#9ca3af;margin:0">© ${year} LeetLab · Built for developers</p>
  </div>
`;

const emailWrapper = (content) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
    ${content}
    ${emailFooter}
  </div>
`;

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
      emailWrapper(`
        ${emailHeader}
          <p style="color:#a5b4fc;font-size:13px;margin:0">Verify your email to get started</p>
        </div>
        <div style="padding:32px 40px;background:#ffffff">
          <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:24px">
            Hi there! Use the OTP below to complete your registration. It expires in <strong>10 minutes</strong>.
          </p>
          <div style="background:#f5f3ff;border:1.5px dashed #a5b4fc;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px">
            <p style="font-size:12px;color:#6d28d9;margin:0 0 8px;letter-spacing:.05em;text-transform:uppercase">Your verification code</p>
            <p style="font-size:36px;font-weight:700;letter-spacing:10px;color:#4f46e5;margin:0">${otp}</p>
          </div>
          <p style="font-size:13px;color:#9ca3af;line-height:1.5">
            If you didn't request this, you can safely ignore this email. Do not share this code with anyone.
          </p>
        </div>
      `),
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
      emailWrapper(`
        ${emailHeader}
          <p style="color:#a5b4fc;font-size:13px;margin:0">Welcome to the community</p>
        </div>
        <div style="padding:32px 40px;background:#ffffff">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#ecfdf5;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;text-align:center">🎉</div>
          </div>
          <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px">Hi <strong>${name}</strong>, your account is ready!</p>
          <p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:24px">
            You've successfully joined LeetLab. Start solving problems, track your progress, and level up your coding skills.
          </p>
          <div style="background:#f5f3ff;border-radius:8px;padding:16px 20px;margin-bottom:24px">
            <p style="font-size:13px;color:#6d28d9;font-weight:500;margin:0 0 10px">What you can do now:</p>
            <div style="display:flex;flex-direction:column;gap:8px">
              <div style="font-size:13px;color:#374151">✦ &nbsp;Solve 100+ coding challenges</div>
              <div style="font-size:13px;color:#374151">✦ &nbsp;Join contests and climb the leaderboard</div>
              <div style="font-size:13px;color:#374151">✦ &nbsp;Track your solve streak and analytics</div>
            </div>
          </div>
          <div style="text-align:center">
            <a href="${process.env.CLIENT_URL}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              Start coding →
            </a>
          </div>
        </div>
      `),
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
      emailWrapper(`
        ${emailHeader}
          <p style="color:#a5b4fc;font-size:13px;margin:0">Password reset request</p>
        </div>
        <div style="padding:32px 40px;background:#ffffff">
          <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:24px">
            We received a request to reset your password. Use the code below — it's valid for <strong>10 minutes</strong>.
          </p>
          <div style="background:#fff7ed;border:1.5px dashed #fb923c;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px">
            <p style="font-size:12px;color:#c2410c;margin:0 0 8px;letter-spacing:.05em;text-transform:uppercase">Password reset code</p>
            <p style="font-size:36px;font-weight:700;letter-spacing:10px;color:#ea580c;margin:0">${otp}</p>
          </div>
          <div style="background:#fef2f2;border-left:3px solid #ef4444;border-radius:0 6px 6px 0;padding:12px 16px;margin-bottom:24px">
            <p style="font-size:13px;color:#991b1b;margin:0">
              If you didn't request a password reset, please secure your account immediately and ignore this email.
            </p>
          </div>
          <p style="font-size:13px;color:#9ca3af;line-height:1.5">Never share this code. LeetLab support will never ask for it.</p>
        </div>
      `),
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
      emailWrapper(`
        ${emailHeader}
          <p style="color:#a5b4fc;font-size:13px;margin:0">Account security update</p>
        </div>
        <div style="padding:32px 40px;background:#ffffff">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-block;background:#ecfdf5;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;text-align:center">🔒</div>
          </div>
          <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px">Hi there, your password has been updated successfully.</p>
          <p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:24px">
            Your LeetLab account password was changed. If this was you, no action is needed.
            If you didn't make this change, please contact support immediately.
          </p>
          <div style="background:#ecfdf5;border-radius:8px;padding:14px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px">
            <span style="font-size:20px">✅</span>
            <div>
              <p style="font-size:13px;font-weight:600;color:#065f46;margin:0 0 2px">Password changed</p>
              <p style="font-size:12px;color:#6b7280;margin:0">If this wasn't you, contact support right away.</p>
            </div>
          </div>
          <div style="text-align:center">
            <a href="${process.env.CLIENT_URL}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              Log in to your account →
            </a>
          </div>
        </div>
      `),
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

