import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate, Link } from "react-router-dom";
import {
  Code,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Send,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const { requestPasswordResetOtp, resetPasswordWithOtp } = useAuthStore();

  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  const startCooldown = () => setCountdown(RESEND_COOLDOWN);

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await requestPasswordResetOtp(email);
      setMessage(res.message);
      setStep(2);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      startCooldown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await requestPasswordResetOtp(email);
      setMessage(res.message);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      startCooldown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const updated = [...otpDigits];
    updated[index] = value.substring(value.length - 1);
    setOtpDigits(updated);
    setOtpError("");
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const updated = [...otpDigits];
      updated[index - 1] = "";
      setOtpDigits(updated);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (updated[i] = char));
    setOtpDigits(updated);
    setOtpError("");
    const nextEmpty = updated.findIndex((d) => !d);
    const focusIndex = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const otp = otpDigits.join("");
    if (otp.length < OTP_LENGTH) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithOtp(
        email,
        otp,
        oldPassword,
        newPassword,
        confirmPassword,
      );
      setMessage(res.message + " Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const otpFilled = otpDigits.join("").length === OTP_LENGTH;

  return (
    <div className="h-screen grid lg:grid-cols-2 relative overflow-hidden bg-[#0a0a0f]">
      {/* Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl z-0 animate-pulse" />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-900/25 rounded-full blur-3xl z-0 animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-950/20 rounded-full blur-3xl z-0" />
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.22]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(124,58,237,0.5) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Diagonal shimmer */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(124,58,237,0.8) 0px, rgba(124,58,237,0.8) 1px, transparent 0px, transparent 50%)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Reset Password</h1>
              <p className="text-base-content/60">
                {step === 1
                  ? "Enter your email to receive a reset code"
                  : "Enter the OTP and set a new password"}
              </p>
            </div>
          </div>

          {/* Step 1 — Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-error text-sm">{error}</p>}
              {message && <p className="text-success text-sm">{message}</p>}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Reset OTP
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-base-content/60">
                  Remembered your password?{" "}
                  <Link to="/login" className="link link-primary">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Step 2 — OTP + new password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Locked email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10 bg-base-200 cursor-not-allowed"
                    value={email}
                    disabled
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                </div>
              </div>

              {/* 6-box OTP */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Enter OTP</span>
                  <span className="label-text-alt text-success flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Sent to {email}
                  </span>
                </label>
                <div className="flex gap-2 justify-between">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className={`input input-bordered w-full max-w-[48px] h-12 text-center text-xl font-bold p-0 ${
                        otpError ? "input-error" : digit ? "input-primary" : ""
                      }`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-error text-sm mt-1">{otpError}</p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 h-auto text-base-content/50 no-underline hover:no-underline"
                    onClick={() => {
                      setStep(1);
                      setOtpDigits(Array(OTP_LENGTH).fill(""));
                      setOtpError("");
                      setError("");
                      setMessage("");
                      clearTimeout(timerRef.current);
                      setCountdown(0);
                    }}
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 h-auto gap-1 no-underline hover:no-underline disabled:opacity-40"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>

              {/* Old Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Current Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type={showOld ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? (
                      <EyeOff className="h-5 w-5 text-base-content/40" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">New Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? (
                      <EyeOff className="h-5 w-5 text-base-content/40" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Confirm New Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-5 w-5 text-base-content/40" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-error text-sm">{error}</p>}
              {message && <p className="text-success text-sm">{message}</p>}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading || !otpFilled}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title={"Secure your account"}
        subtitle={
          "Reset your password to regain access to your LeetLab account."
        }
      />
    </div>
  );
};

export default ForgotPassword;
