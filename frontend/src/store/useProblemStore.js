import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  dailyProblem: null,
  isProblemsLoading: false,
  isProblemLoading: false,
  isDailyProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");

      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error in getAllProblem", error);
      toast.error(error.response?.data?.error || "Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data.problem });
    } catch (error) {
      console.log("Error in getProblemById", error);
      toast.error(error.response?.data?.error || "Error in getting problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");

      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.log("Error in getSolvedProblemByUser", error);
      toast.error(
        error.response?.data?.error || "Error in getting solved problems",
      );
    }
  },
  deleteProblem: async (id) => {
    try {
      set({ isDeletingProblem: true });
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error deleting problem", error);
      toast.error(error.response?.data?.error || "Error deleting problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },
  updateProblem: async (id, data) => {
    try {
      set({ isUpdatingProblem: true });
      const res = await axiosInstance.put(
        `/problems/update-problem/${id}`,
        data,
        {
          withCredentials: true,
        },
      );
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error updating problem", error);
      toast.error(error.response?.data?.error || "Error updating problem");
    } finally {
      set({ isUpdatingProblem: false });
    }
  },

  getDailyProblem: async () => {
    try {
      set({ isDailyProblemLoading: true });
      const res = await axiosInstance.get("/problems/daily-challenge");
      set({ dailyProblem: res.data.dailyChallenge });
    } catch (error) {
      console.log("Error in getDailyProblem", error);
    } finally {
      set({ isDailyProblemLoading: false });
    }
  },
}));
