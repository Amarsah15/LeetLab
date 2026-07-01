import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useDiscussionStore = create((set) => ({
  discussions: [],
  isLoading: false,

  getDiscussions: async (problemId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/discussions/${problemId}`);
      set({ discussions: res.data.discussions });
    } catch (error) {
      console.error("Error fetching discussions:", error);
      toast.error(error.response?.data?.error || "Error fetching discussions");
    } finally {
      set({ isLoading: false });
    }
  },

  createDiscussion: async (problemId, content, parentId = null) => {
    try {
      const res = await axiosInstance.post(`/discussions/${problemId}`, {
        content,
        parentId,
      });
      toast.success(res.data.message);
      return res.data.discussion;
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error(error.response?.data?.error || "Error posting discussion");
      return null;
    }
  },

  deleteDiscussion: async (discussionId) => {
    try {
      await axiosInstance.delete(`/discussions/${discussionId}`);
      toast.success("Discussion deleted");
      return true;
    } catch (error) {
      console.error("Error deleting discussion:", error);
      toast.error(error.response?.data?.error || "Error deleting discussion");
      return false;
    }
  },

  updateDiscussion: async (discussionId, content) => {
    try {
      const res = await axiosInstance.put(`/discussions/${discussionId}`, {
        content,
      });
      toast.success("Comment updated successfully");
      return res.data.discussion;
    } catch (error) {
      console.error("Error updating discussion:", error);
      toast.error(error.response?.data?.error || "Error updating comment");
      return null;
    }
  },

  toggleUpvote: async (discussionId) => {
    try {
      const res = await axiosInstance.post(
        `/discussions/${discussionId}/upvote`,
      );
      return res.data.upvotes;
    } catch (error) {
      console.error("Error toggling upvote:", error);
      toast.error(error.response?.data?.error || "Error toggling upvote");
      return null;
    }
  },
}));
