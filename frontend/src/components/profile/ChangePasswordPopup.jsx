import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  X,
  Lock,
  Mail,
  CheckCircle,
  Send,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Validate password fields before sending OTP
    const isValid = await trigger([
      "oldPassword",
      "newPassword",
      "confirmPassword",
    ]);

    if (!isValid) {
      return;
    }

    // Check if new password and confirm password match
    const { newPassword, confirmPassword } = getValues();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    setSendingOtp(true);
    try {
      await requestPasswordResetOtp(authUser.email);
      setOtpSent(true);
    } catch (error) {
      console.error("OTP request error", error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleFormSubmit = async (data) => {
    if (!otpSent) {
      return;
    }

    await onSubmit(data);
    reset();
    setOtpSent(false);
    logout();
    navigate("/login");
    onClose();
  };

  const handleClose = () => {
    reset();
    setOtpSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Change Password</h3>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-5"
        >
          {/* Email Field (Disabled) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10 bg-base-200 cursor-not-allowed"
                defaultValue={authUser.email}
                disabled
                {...register("email")}
              />
            </div>
          </div>

          {/* Old Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Current Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="password"
                className={`input input-bordered w-full pl-10 ${
                  otpSent ? "bg-base-200 cursor-not-allowed" : ""
                }`}
                placeholder="Enter current password"
                disabled={otpSent}
                {...register("oldPassword", {
                  required: "Current password is required",
                })}
              />
              {otpSent && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              )}
            </div>
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
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
                type="password"
                className={`input input-bordered w-full pl-10 ${
                  otpSent ? "bg-base-200 cursor-not-allowed" : ""
                }`}
                placeholder="Enter new password"
                disabled={otpSent}
                {...register("newPassword", {
                  required: "New password is required",
                })}
              />
              {otpSent && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              )}
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
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
                type="password"
                className={`input input-bordered w-full pl-10 ${
                  otpSent ? "bg-base-200 cursor-not-allowed" : ""
                }`}
                placeholder="Confirm new password"
                disabled={otpSent}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              {otpSent && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Send OTP Button */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="btn btn-outline btn-primary w-full"
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
                  Send OTP to Email
                </>
              )}
            </button>
          )}

          {/* OTP Input - Only shown after OTP is sent */}
          {otpSent && (
            <div className="form-control animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="label">
                <span className="label-text font-medium">Enter OTP</span>
                <span className="label-text-alt text-success flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  OTP sent to your email
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="input input-bordered input-primary w-full text-center text-lg tracking-widest font-semibold"
                  placeholder="• • • • • •"
                  maxLength={6}
                  autoFocus
                  {...register("otp", { required: "OTP is required" })}
                />
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.otp.message}
                </p>
              )}
              <button
                type="button"
                className="btn btn-link btn-sm mt-2 self-start"
                onClick={() => setOtpSent(false)}
              >
                Change password or resend OTP
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>

            {/* Submit Button - Only shown after OTP is sent */}
            {otpSent && (
              <button type="submit" className="btn btn-primary flex-1">
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            )}
          </div>
        </form>

        {/* Info Box */}
        <div className="px-6 pb-6">
          <div className="bg-info/10 border border-info/20 rounded-lg p-3">
            <p className="text-sm">
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
