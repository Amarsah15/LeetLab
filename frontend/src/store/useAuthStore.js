import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data.user });
    } catch (error) {
      console.log("checkAuth error", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/verify-otp-register", data);

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error(error.response?.data?.error || "Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  // singup with otp
  signupWithOtp: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/request-otp-register", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error(error.response?.data?.error || "Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error(error.response?.data?.error || "Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error(error.response?.data?.error || "Error logging out");
    }
  },

  changePassword: async (data) => {
    try {
      set({ isPasswordReset: true });
      const res = await axiosInstance.post(
        "/auth/reset-password-with-otp",
        data,
        {
          withCredentials: true,
        },
      );

      toast.success(res.data.message);
      set({ resetSuccessfully: true });
    } catch (error) {
      console.log("Error forgot password", error);
      toast.error(error.response?.data?.error || "Error changing password");
    } finally {
      set({ isPasswordReset: false });
    }
  },

  requestPasswordResetOtp: async (email) => {
    try {
      const response = await axiosInstance.post(
        "/auth/request-password-reset-otp",
        { email },
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error requesting password reset OTP", error);
      toast.error(
        error.response?.data?.error || "Error requesting password reset OTP",
      );
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axiosInstance.put("/user/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ authUser: res.data.user });
      toast.success("Profile image updated successfully");
      return res.data.user;
    } catch (error) {
      console.log("Error uploading profile image:", error);
      toast.error(
        error.response?.data?.error || "Failed to upload profile image",
      );
      return null;
    }
  },

  removeProfileImage: async () => {
    try {
      const res = await axiosInstance.delete("/user/profile-image");
      set({ authUser: res.data.user });
      toast.success("Profile image removed");
      return res.data.user;
    } catch (error) {
      console.log("Error removing profile image:", error);
      toast.error(
        error.response?.data?.error || "Failed to remove profile image",
      );
      return null;
    }
  },
}));
