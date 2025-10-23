import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAIStore = create((set) => ({
  // State
  result: "",
  isAnalyzingComplexity: false,
  isGettingHint: false,
  isGettingImprovements: false,

  // Analyze Complexity
  analyzeComplexity: async (code, language) => {
    set({ isAnalyzingComplexity: true, result: "" });
    try {
      const res = await axiosInstance.post("/ai/analyze-complexity", {
        code,
        language,
      });
      set({ result: res.data.analysis });
      toast.success("Complexity analysis completed");
    } catch (error) {
      console.log("Error analyzing complexity", error);
      toast.error(
        error.response?.data?.error || "Failed to analyze complexity"
      );
    } finally {
      set({ isAnalyzingComplexity: false });
    }
  },

  // Get Hint
  getHint: async (problemDescription, userCode = "", hintLevel = 1) => {
    set({ isGettingHint: true, result: "" });
    try {
      const res = await axiosInstance.post("/ai/get-hint", {
        problemDescription,
        userCode,
        hintLevel,
      });
      set({ result: res.data.hint });
      toast.success(`Level ${hintLevel} hint received`);
    } catch (error) {
      console.log("Error getting hint", error);
      toast.error(error.response?.data?.error || "Failed to get hint");
    } finally {
      set({ isGettingHint: false });
    }
  },

  // Get Improvement Suggestions
  getImprovementSuggestions: async (code, problemDescription, language) => {
    set({ isGettingImprovements: true, result: "" });
    try {
      const res = await axiosInstance.post("/ai/get-improvements", {
        code,
        problemDescription,
        language,
      });
      set({ result: res.data.improvements });
      toast.success("Improvement suggestions received");
    } catch (error) {
      console.log("Error getting improvements", error);
      toast.error(error.response?.data?.error || "Failed to get improvements");
    } finally {
      set({ isGettingImprovements: false });
    }
  },

  // Clear result
  clearResult: () => set({ result: "" }),
}));
