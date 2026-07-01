import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useLeaderboardStore = create((set) => ({
  leaderboard: [],
  isLoading: false,

  getLeaderboard: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/leaderboard");
      set({ leaderboard: res.data.leaderboard });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error(error.response?.data?.error || "Error fetching leaderboard");
    } finally {
      set({ isLoading: false });
    }
  },
}));
