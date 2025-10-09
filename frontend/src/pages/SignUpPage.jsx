import React, { useState } from "react";
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
      "Password must contain at least one special character"
    ),
  name: z.string().min(3, "Name must be at least 3 characters"),
  otp: z.string().length(6, "OTP must be 6 characters").optional(),
});

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const { signup, signupWithOtp, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const handleRequestOtp = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate name, email, and password before sending OTP
    const isValid = await trigger(["name", "email", "password"]);

    if (!isValid) {
      return;
    }

    setSendingOtp(true);
    try {
      const { name, email, password } = getValues();
      await signupWithOtp({ name, email, password });
      setOtpSent(true);
    } catch (error) {
      console.error("OTP request error", error);
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmit = async (data) => {
    // Only proceed with signup if OTP has been sent
    if (!otpSent) {
      return;
    }

    try {
      await signup(data);
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

            {/* Request OTP Button */}
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

            {/* OTP Input - Only shown after OTP is sent */}
            {otpSent && (
              <div className="form-control animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="label">
                  <span className="label-text font-medium">Enter OTP</span>
                  <span className="label-text-alt text-success">
                    OTP sent to your email
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("otp")}
                    className={`input input-bordered w-full text-center text-lg tracking-widest font-semibold ${
                      errors.otp ? "input-error" : "input-primary"
                    }`}
                    placeholder="• • • • • •"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.otp.message}
                  </p>
                )}
                <button
                  type="button"
                  className="btn btn-link btn-sm mt-2"
                  onClick={() => {
                    setOtpSent(false);
                  }}
                >
                  Change email or resend OTP
                </button>
              </div>
            )}

            {/* Submit Button - Only shown after OTP is sent */}
            {otpSent && (
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSigninUp}
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
