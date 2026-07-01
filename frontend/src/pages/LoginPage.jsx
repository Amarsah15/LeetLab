import React, { useState, useEffect, useRef } from "react";
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
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore.js";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);
  const emailRef = useRef(null);

  const { login, isLoggingIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });

  // Auto-focus email field
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const onError = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 600);
  };

  const { ref: emailRegRef, ...emailRegRest } = register("email");

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle bg gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 blur-[80px] rounded-full" />

        <motion.div
          className={`w-full max-w-md space-y-8 relative z-10 ${shakeForm ? "animate-shake" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/40 text-sm">
                Sign in to continue coding
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-5"
          >
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
                  {...emailRegRest}
                  ref={(e) => {
                    emailRegRef(e);
                    emailRef.current = e;
                  }}
                  className={`input w-full pl-10 glass-input ${
                    errors.email ? "!border-error" : ""
                  }`}
                  placeholder="you@example.com"
                />
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
                  className={`input w-full pl-10 pr-10 glass-input ${
                    errors.password ? "!border-error" : ""
                  }`}
                  placeholder="••••••••"
                />
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
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="btn-gradient btn w-full gap-2 font-semibold"
              disabled={isLoggingIn}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-2">
            <Link
              to="/forgot-password"
              className="text-base-content/40 text-sm hover:text-primary transition-colors block"
            >
              Forgot your password?
            </Link>
            <p className="text-base-content/40 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your journey. Don't have an account? Create one now."
        }
      />
    </div>
  );
};

export default LoginPage;
