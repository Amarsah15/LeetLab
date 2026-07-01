import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  isRunning: false,
  submission: null,
  runResult: null,

  runCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
  ) => {
    try {
      set({ isRunning: true, runResult: null, submission: null });

      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
        mode: "run",
      });
      set({ runResult: res.data.submission });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error running code", error);
      toast.error(error.response?.data?.error || "Error running code");
    } finally {
      set({ isRunning: false });
    }
  },

  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
  ) => {
    try {
      set({ isExecuting: true, submission: null, runResult: null });

      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
        mode: "submit",
      });
      set({ submission: res.data.submission });

      // Update local authUser state with new streak from response
      const currentAuthUser = useAuthStore.getState().authUser;
      if (currentAuthUser && res.data.user) {
        useAuthStore.setState({
          authUser: {
            ...currentAuthUser,
            currentStreak: res.data.user.currentStreak,
            maxStreak: res.data.user.maxStreak,
          },
        });
      }

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error(error.response?.data?.error || "Error executing code");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
