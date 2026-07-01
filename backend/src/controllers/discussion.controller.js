import Discussion from "../models/discussion.model.js";

export const getDiscussions = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Fetch all top-level discussions (no parentId)
    const topLevel = await Discussion.find({ problemId, parentId: null })
      .populate("userId", "name image")
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all replies in one query
    const topLevelIds = topLevel.map((d) => d._id);
    const replies = await Discussion.find({ parentId: { $in: topLevelIds } })
      .populate("userId", "name image")
      .sort({ createdAt: 1 })
      .lean();

    // Group replies by parentId
    const repliesByParent = {};
    replies.forEach((reply) => {
      const parentKey = reply.parentId.toString();
      if (!repliesByParent[parentKey]) {
        repliesByParent[parentKey] = [];
      }
      repliesByParent[parentKey].push(reply);
    });

    // Attach replies to their parent discussions
    const discussions = topLevel.map((discussion) => ({
      ...discussion,
      replies: repliesByParent[discussion._id.toString()] || [],
    }));

    res.status(200).json({
      success: true,
      message: "Discussions fetched successfully",
      discussions,
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({ error: "Internal server error in getDiscussions" });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (content.length > 5000) {
      return res
        .status(400)
        .json({ error: "Content must be 5000 characters or less" });
    }

    // If replying, verify parent exists and belongs to the same problem
    if (parentId) {
      const parentDiscussion = await Discussion.findById(parentId);
      if (!parentDiscussion) {
        return res.status(404).json({ error: "Parent discussion not found" });
      }
      if (parentDiscussion.problemId.toString() !== problemId) {
        return res
          .status(400)
          .json({ error: "Reply must belong to the same problem" });
      }
    }

    const discussion = await Discussion.create({
      problemId,
      userId,
      content: content.trim(),
      parentId: parentId || null,
    });

    const populated = await Discussion.findById(discussion._id)
      .populate("userId", "name image")
      .lean();

    res.status(201).json({
      success: true,
      message: parentId
        ? "Reply posted successfully"
        : "Discussion posted successfully",
      discussion: populated,
    });
  } catch (error) {
    console.error("Error creating discussion:", error);
    res
      .status(500)
      .json({ error: "Internal server error in createDiscussion" });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    // Only the author or an admin can delete
    if (
      discussion.userId.toString() !== userId.toString() &&
      req.user.role !== "ADMIN"
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this discussion" });
    }

    // Cascade-delete all replies if this is a top-level discussion
    if (!discussion.parentId) {
      await Discussion.deleteMany({ parentId: discussionId });
    }

    await Discussion.findByIdAndDelete(discussionId);

    res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res
      .status(500)
      .json({ error: "Internal server error in deleteDiscussion" });
  }
};

export const toggleUpvote = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    const hasUpvoted = discussion.upvotes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (hasUpvoted) {
      // Remove upvote
      discussion.upvotes = discussion.upvotes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      // Add upvote
      discussion.upvotes.push(userId);
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      message: hasUpvoted ? "Upvote removed" : "Upvoted successfully",
      upvotes: discussion.upvotes,
    });
  } catch (error) {
    console.error("Error toggling upvote:", error);
    res.status(500).json({ error: "Internal server error in toggleUpvote" });
  }
};

export const updateDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (content.length > 5000) {
      return res
        .status(400)
        .json({ error: "Content must be 5000 characters or less" });
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    // Only the author can edit
    if (discussion.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this discussion" });
    }

    discussion.content = content.trim();
    await discussion.save();

    const populated = await Discussion.findById(discussionId)
      .populate("userId", "name image")
      .lean();

    res.status(200).json({
      success: true,
      message: "Discussion updated successfully",
      discussion: populated,
    });
  } catch (error) {
    console.error("Error updating discussion:", error);
    res
      .status(500)
      .json({ error: "Internal server error in updateDiscussion" });
  }
};
