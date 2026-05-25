import React, { useState, useRef, useEffect } from "react";
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
  CheckCircle,
  Send,
  RefreshCw,
} from "lucide-react";
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

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  const { signup, signupWithOtp, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    setValue,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  // Sync assembled OTP into react-hook-form
  useEffect(() => {
    setValue("otp", otpDigits.join(""));
  }, [otpDigits, setValue]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  const startCooldown = () => setCountdown(RESEND_COOLDOWN);

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    const isValid = await trigger(["name", "email", "password"]);
    if (!isValid) return;

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
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setOtpError("");

    // Auto-advance
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

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome</h1>
              <p className="text-base-content/60">Sign Up to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  disabled={otpSent}
                  className={`input input-bordered w-full pl-10 ${
                    errors.name ? "input-error" : ""
                  } ${otpSent ? "bg-base-200 cursor-not-allowed" : ""}`}
                  placeholder="John Doe"
                />
                {otpSent && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
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
                  {...register("email")}
                  disabled={otpSent}
                  className={`input input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : ""
                  } ${otpSent ? "bg-base-200 cursor-not-allowed" : ""}`}
                  placeholder="you@example.com"
                />
                {otpSent && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={otpSent}
                  className={`input input-bordered w-full pl-10 pr-10 ${
                    errors.password ? "input-error" : ""
                  } ${otpSent ? "bg-base-200 cursor-not-allowed" : ""}`}
                  placeholder="••••••••"
                />
                {!otpSent && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-base-content/40" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/40" />
                    )}
                  </button>
                )}
                {otpSent && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <button
                type="button"
                className="btn btn-outline btn-primary w-full"
                onClick={handleRequestOtp}
                disabled={sendingOtp}
              >
                {sendingOtp ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send OTP
                  </>
                )}
              </button>
            )}

            {/* OTP Input - 6 boxes */}
            {otpSent && (
              <div className="form-control animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="label">
                  <span className="label-text font-medium">Enter OTP</span>
                  <span className="label-text-alt text-success flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Sent to {getValues("email")}
                  </span>
                </label>

                {/* 6-digit boxes */}
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
                  <p className="text-red-500 text-sm mt-1">{otpError}</p>
                )}

                {/* Resend row */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 h-auto text-base-content/50 no-underline hover:no-underline"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpDigits(Array(OTP_LENGTH).fill(""));
                      setOtpError("");
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
                    disabled={countdown > 0 || sendingOtp}
                  >
                    {sendingOtp ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {otpSent && (
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSigninUp || otpDigits.join("").length < OTP_LENGTH}
              >
                {isSigninUp ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Creating Account...
                  </>
                ) : (
                  "Verify & Sign Up"
                )}
              </button>
            )}
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome to our platform!"}
        subtitle={
          "Sign up to access our platform and start using our services."
        }
      />
    </div>
  );
};

export default SignUpPage;
