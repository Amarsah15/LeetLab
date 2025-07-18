import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom"; // Assuming you use react-router-dom

const RegisterWithOtp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { requestOtpForRegistration, verifyOtpAndRegister } = useAuthStore();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await requestOtpForRegistration(name, email, password);
      setMessage(res.message);
      setOtpRequested(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request OTP");
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await verifyOtpAndRegister(name, email, password, otp);
      setMessage(res.message + ". Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after successful registration
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to verify OTP and register"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl mb-4">
            Register with OTP
          </h2>
          {!otpRequested ? (
            <form onSubmit={handleRequestOtp}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mt-4">
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
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-error mt-4">{error}</div>}
              {message && <div className="text-success mt-4">{message}</div>}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Request OTP
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpAndRegister}>
              <div className="form-control">
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
              {error && <div className="text-error mt-4">{error}</div>}
              {message && <div className="text-success mt-4">{message}</div>}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Verify OTP & Register
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterWithOtp;
