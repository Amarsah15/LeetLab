import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAdminStore = create((set) => ({
  analytics: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/analytics");
      if (response.data.success) {
        set({ analytics: response.data.data, isLoading: false });
      } else {
        set({ error: "Failed to fetch analytics", isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching admin analytics:", error);
      set({
        error: error.response?.data?.error || "Error loading admin analytics",
        isLoading: false,
      });
    }
  },
}));
