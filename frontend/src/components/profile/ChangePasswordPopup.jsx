import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  X,
  Lock,
  Eye,
  EyeOff,
  Mail,
  CheckCircle,
  Send,
  Loader2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const ChangePasswordPopup = ({ isOpen, onClose, onSubmit }) => {
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { authUser, logout, requestPasswordResetOtp } = useAuthStore();

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  const startCooldown = () => setCountdown(RESEND_COOLDOWN);

  const sendOtp = async () => {
    setSendingOtp(true);
    try {
      await requestPasswordResetOtp(authUser.email);
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const isValid = await trigger([
      "oldPassword",
      "newPassword",
      "confirmPassword",
    ]);
    if (!isValid) return;

    const { newPassword, confirmPassword } = getValues();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    await sendOtp();
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    await sendOtp();
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
    inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();
  };

  const handleFormSubmit = async (data) => {
    if (!otpSent) return;

    const otp = otpDigits.join("");
    if (otp.length < OTP_LENGTH) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    await onSubmit({ ...data, otp });
    reset();
    setOtpSent(false);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    clearTimeout(timerRef.current);
    setCountdown(0);
    logout();
    navigate("/login");
    onClose();
  };

  const handleClose = () => {
    reset();
    setOtpSent(false);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    clearTimeout(timerRef.current);
    setCountdown(0);
    onClose();
  };

  const otpFilled = otpDigits.join("").length === OTP_LENGTH;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up duration-150">
      <div className="glass-card bg-base-100/95 border border-base-content/10 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col transform transition-all duration-300 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-base-content/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Change Password</h3>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-content/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-5 flex-1"
        >
          {/* Email (locked) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-xs text-base-content/60">
                Email Address
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-base-content/40" />
              </div>
              <input
                type="text"
                className="input input-bordered glass-input w-full pl-10 bg-base-200/50 cursor-not-allowed text-sm"
                defaultValue={authUser.email}
                disabled
                {...register("email")}
              />
            </div>
          </div>

          {/* Current Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-xs text-base-content/60">
                Current Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-base-content/40" />
              </div>
              <input
                type={showOld ? "text" : "password"}
                className={`input input-bordered glass-input w-full pl-10 pr-10 text-sm ${otpSent ? "bg-base-200/50 cursor-not-allowed" : ""}`}
                placeholder="Enter current password"
                disabled={otpSent}
                {...register("oldPassword", {
                  required: "Current password is required",
                })}
              />
              {otpSent ? (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
              ) : (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowOld(!showOld)}
                >
                  {showOld ? (
                    <EyeOff className="h-4 w-4 text-base-content/40" />
                  ) : (
                    <Eye className="h-4 w-4 text-base-content/40" />
                  )}
                </button>
              )}
            </div>
            {errors.oldPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-xs text-base-content/60">
                New Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-base-content/40" />
              </div>
              <input
                type={showNew ? "text" : "password"}
                className={`input input-bordered glass-input w-full pl-10 pr-10 text-sm ${otpSent ? "bg-base-200/50 cursor-not-allowed" : ""}`}
                placeholder="Enter new password"
                disabled={otpSent}
                {...register("newPassword", {
                  required: "New password is required",
                })}
              />
              {otpSent ? (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
              ) : (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4 text-base-content/40" />
                  ) : (
                    <Eye className="h-4 w-4 text-base-content/40" />
                  )}
                </button>
              )}
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-xs text-base-content/60">
                Confirm New Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-base-content/40" />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                className={`input input-bordered glass-input w-full pl-10 pr-10 text-sm ${otpSent ? "bg-base-200/50 cursor-not-allowed" : ""}`}
                placeholder="Confirm new password"
                disabled={otpSent}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              {otpSent ? (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
              ) : (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4 text-base-content/40" />
                  ) : (
                    <Eye className="h-4 w-4 text-base-content/40" />
                  )}
                </button>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Send OTP Button */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="btn btn-gradient w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
              disabled={sendingOtp}
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send OTP to Email
                </>
              )}
            </button>
          )}

          {/* 6-box OTP */}
          {otpSent && (
            <div className="form-control animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="label">
                <span className="label-text font-medium text-xs text-base-content/60">
                  Enter OTP
                </span>
                <span className="label-text-alt text-success text-xs flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Sent to {authUser.email}
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
                    className={`input input-bordered glass-input w-full max-w-[48px] h-12 text-center text-xl font-bold p-0 rounded-lg ${
                      otpError ? "input-error" : digit ? "input-primary" : ""
                    }`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-error text-xs mt-1">{otpError}</p>
              )}

              <div className="flex items-center justify-between mt-3 text-xs">
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
                  Change details
                </button>
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 h-auto gap-1 no-underline hover:no-underline disabled:opacity-40"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || sendingOtp}
                >
                  {sendingOtp ? (
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {otpSent && (
            <div className="pt-4 border-t border-base-content/5">
              <button
                type="submit"
                className="btn btn-gradient w-full py-2.5 text-sm flex items-center justify-center gap-2 rounded-lg"
                disabled={!otpFilled}
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>
          )}
        </form>

        {/* Info Box */}
        <div className="px-6 pb-6 mt-1">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
            <p className="text-xs text-base-content/60 leading-relaxed">
              💡 After changing your password, you'll be logged out and need to
              sign in with your new password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
