import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { requestPasswordResetOtp, resetPasswordWithOtp } = useAuthStore();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await requestPasswordResetOtp(email);
      setMessage(res.message);
      setStep(2); // Move to the next step to enter OTP and new password
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await resetPasswordWithOtp(
        email,
        otp,
        newPassword,
        confirmPassword
      );
      setMessage(res.message + " Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after successful password reset
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl mb-4">
            Forgot Password
          </h2>
          {step === 1 && (
            <form onSubmit={handleRequestOtp}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-error mt-4">{error}</div>}
              {message && <div className="text-success mt-4">{message}</div>}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Request Reset OTP
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled // Email should not change at this step
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">OTP</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="input input-bordered"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-error mt-4">{error}</div>}
              {message && <div className="text-success mt-4">{message}</div>}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Reset Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
