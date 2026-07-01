import React, { useState, useRef, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  CheckCircle,
  Send,
  RefreshCw,
  ArrowRight,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore.js";

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
  name: z.string().min(3, "Name must be at least 3 characters"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-error" };
  if (score <= 3) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 4) return { score, label: "Good", color: "bg-info" };
  return { score, label: "Strong", color: "bg-success" };
};

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [shakeForm, setShakeForm] = useState(false);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const nameRef = useRef(null);

  const { signup, signupWithOtp, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const watchedPassword = watch("password", "");
  const strength = useMemo(
    () => getPasswordStrength(watchedPassword),
    [watchedPassword],
  );

  // Auto-focus name field
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Sync OTP into form
  useEffect(() => {
    setValue("otp", otpDigits.join(""));
  }, [otpDigits, setValue]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  // OTP auto-submit
  useEffect(() => {
    const otp = otpDigits.join("");
    if (otp.length === OTP_LENGTH && otpSent) {
      handleSubmit(onSubmit)();
    }
  }, [otpDigits]);

  const startCooldown = () => setCountdown(RESEND_COOLDOWN);

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    const isValid = await trigger(["name", "email", "password"]);
    if (!isValid) {
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 600);
      return;
    }

    setSendingOtp(true);
    try {
      const { name, email, password } = getValues();
      await signupWithOtp({ name, email, password });
      setOtpSent(true);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      startCooldown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      console.error("OTP request error", error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setSendingOtp(true);
    try {
      const { name, email, password } = getValues();
      await signupWithOtp({ name, email, password });
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      startCooldown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      console.error("Resend OTP error", error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setOtpError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        const updated = [...otpDigits];
        updated[index] = "";
        setOtpDigits(updated);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
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

  const onSubmit = async (data) => {
    if (!otpSent) return;
    const otp = otpDigits.join("");
    if (otp.length < OTP_LENGTH) {
      setOtpError("Please enter all 6 digits");
      return;
    }
    try {
      await signup({ ...data, otp });
    } catch (error) {
      console.error("Signup error", error);
    }
  };

  const { ref: nameRegRef, ...nameRegRest } = register("name");

  return (
    <div className="min-h-[calc(100vh-76px)] lg:h-[calc(100vh-76px)] grid lg:grid-cols-2 relative overflow-hidden bg-[#0a0a0f]">
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
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto relative z-10">

        <motion.div
          className={`w-full max-w-md space-y-6 relative z-10 ${shakeForm ? "animate-shake" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/40 text-sm">
                Start your coding journey
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${otpSent ? "text-success" : "text-primary"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${otpSent ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}`}
              >
                {otpSent ? <CheckCircle className="w-3.5 h-3.5" /> : "1"}
              </div>
              Details
            </div>
            <div
              className={`w-8 h-px ${otpSent ? "bg-success/50" : "bg-base-content/10"}`}
            />
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${otpSent ? "text-primary" : "text-base-content/30"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${otpSent ? "bg-primary/20 text-primary" : "bg-base-content/5 text-base-content/30"}`}
              >
                2
              </div>
              Verify
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="text-sm font-medium text-base-content/70">
                  Name
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-base-content/30" />
                </div>
                <input
                  type="text"
                  {...nameRegRest}
                  ref={(e) => {
                    nameRegRef(e);
                    nameRef.current = e;
                  }}
                  disabled={otpSent}
                  className={`input w-full pl-10 glass-input ${errors.name ? "!border-error" : ""} ${otpSent ? "opacity-60" : ""}`}
                  placeholder="John Doe"
                />
                {otpSent && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                )}
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-xs mt-1.5 font-medium"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="text-sm font-medium text-base-content/70">
                  Email
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-base-content/30" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  disabled={otpSent}
                  className={`input w-full pl-10 glass-input ${errors.email ? "!border-error" : ""} ${otpSent ? "opacity-60" : ""}`}
                  placeholder="you@example.com"
                />
                {otpSent && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                )}
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-xs mt-1.5 font-medium"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="text-sm font-medium text-base-content/70">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-base-content/30" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={otpSent}
                  className={`input w-full pl-10 pr-10 glass-input ${errors.password ? "!border-error" : ""} ${otpSent ? "opacity-60" : ""}`}
                  placeholder="••••••••"
                />
                {!otpSent && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/30 hover:text-base-content/60 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
                {otpSent && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                )}
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-xs mt-1.5 font-medium"
                >
                  {errors.password.message}
                </motion.p>
              )}

              {/* Password strength bar */}
              {!otpSent && watchedPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2"
                >
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`strength-bar flex-1 ${i <= strength.score ? strength.color : "bg-base-content/10"}`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-medium ${strength.color.replace("bg-", "text-")}`}
                  >
                    {strength.label}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <motion.button
                type="button"
                className="btn btn-outline btn-primary w-full gap-2 font-semibold"
                onClick={handleRequestOtp}
                disabled={sendingOtp}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {sendingOtp ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send OTP
                  </>
                )}
              </motion.button>
            )}

            {/* OTP Input */}
            <AnimatePresence>
              {otpSent && (
                <motion.div
                  className="form-control"
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="label pb-1">
                    <span className="text-sm font-medium text-base-content/70">
                      Enter OTP
                    </span>
                    <span className="text-xs text-success flex items-center gap-1 font-medium">
                      <CheckCircle className="h-3 w-3" />
                      Sent to {getValues("email")}
                    </span>
                  </label>

                  {/* OTP boxes */}
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
                        className={`input w-full max-w-[48px] h-12 text-center text-xl font-bold p-0 glass-input ${
                          otpError
                            ? "!border-error"
                            : digit
                              ? "!border-primary"
                              : ""
                        }`}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-error text-xs mt-1.5 font-medium"
                    >
                      {otpError}
                    </motion.p>
                  )}

                  {/* Resend / change email */}
                  <div className="flex items-center justify-between mt-3">
                    <button
                      type="button"
                      className="text-xs text-base-content/40 hover:text-base-content/60 transition-colors font-medium"
                      onClick={() => {
                        if (window.confirm("Go back to edit your details?")) {
                          setOtpSent(false);
                          setOtpDigits(Array(OTP_LENGTH).fill(""));
                          setOtpError("");
                          clearTimeout(timerRef.current);
                          setCountdown(0);
                        }
                      }}
                    >
                      Change details
                    </button>
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1 disabled:opacity-40"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || sendingOtp}
                    >
                      {sendingOtp ? (
                        <Loader2 className="animate-spin h-3 w-3" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            {otpSent && (
              <motion.button
                type="submit"
                className="btn-gradient btn w-full gap-2 font-semibold"
                disabled={isSigninUp || otpDigits.join("").length < OTP_LENGTH}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isSigninUp ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Verify & Sign Up
                  </>
                )}
              </motion.button>
            )}
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-base-content/40 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title={"Welcome to LeetLab!"}
        subtitle={
          "Sign up to start solving problems and tracking your progress."
        }
      />
    </div>
  );
};

export default SignUpPage;
