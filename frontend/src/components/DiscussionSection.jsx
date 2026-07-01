import React, { useEffect, useState } from "react";
import { useDiscussionStore } from "../store/useDiscussionStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  MessageSquare,
  ThumbsUp,
  Trash2,
  Reply,
  Send,
  Loader,
  Pencil,
} from "lucide-react";

// Relative time formatter
const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

// Avatar component
const UserAvatar = ({ user, size = "w-8 h-8 text-sm" }) => {
  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.name}
        className={`${size} rounded-full object-cover`}
      />
    );
  }

  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${size} rounded-full bg-gradient-to-r from-blue-800 to-blue-500 flex items-center justify-center font-bold text-white`}
    >
      {initials}
    </div>
  );
};

// Single comment component
const CommentItem = ({
  comment,
  currentUserId,
  isAdmin,
  onReply,
  onDelete,
  onUpvote,
  onEdit,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showEditInput, setShowEditInput] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [localUpvotes, setLocalUpvotes] = useState(comment.upvotes || []);
  const hasUpvoted = localUpvotes.some(
    (id) => id.toString() === currentUserId?.toString(),
  );

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent.trim());
      setReplyContent("");
      setShowReplyInput(false);
    }
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && editContent.trim() !== comment.content) {
      onEdit(comment._id, editContent.trim());
      setShowEditInput(false);
    } else if (editContent.trim() === comment.content) {
      setShowEditInput(false);
    }
  };

  const handleUpvote = async () => {
    const newUpvotes = await onUpvote(comment._id);
    if (newUpvotes !== null) {
      setLocalUpvotes(newUpvotes);
    }
  };

  return (
    <div className="flex gap-3">
      <UserAvatar user={comment.userId} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">
            {comment.userId?.name || "Unknown User"}
          </span>
          <span className="text-xs text-base-content/50">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        {showEditInput ? (
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
              className="input input-bordered input-sm flex-1"
              autoFocus
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleEditSubmit}
              disabled={!editContent.trim()}
            >
              Save
            </button>
            <button
              className="btn btn-ghost btn-sm text-base-content/50"
              onClick={() => {
                setEditContent(comment.content);
                setShowEditInput(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-sm text-base-content/90 whitespace-pre-wrap break-words">
            {comment.content}
            {new Date(comment.updatedAt).getTime() -
              new Date(comment.createdAt).getTime() >
              1000 && (
              <span className="text-[10px] text-base-content/45 ml-2 italic">
                (edited)
              </span>
            )}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-4 mt-2">
          <button
            className={`btn btn-ghost btn-xs gap-1 ${
              hasUpvoted ? "text-primary" : "text-base-content/60"
            }`}
            onClick={handleUpvote}
          >
            <ThumbsUp className="w-3 h-3" />
            {localUpvotes.length > 0 && <span>{localUpvotes.length}</span>}
          </button>

          {!comment.parentId && (
            <button
              className="btn btn-ghost btn-xs gap-1 text-base-content/60"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}

          {comment.userId?._id === currentUserId && (
            <button
              className="btn btn-ghost btn-xs gap-1 text-base-content/60"
              onClick={() => setShowEditInput(!showEditInput)}
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}

          {(comment.userId?._id === currentUserId || isAdmin) && (
            <button
              className="btn btn-ghost btn-xs gap-1 text-error/70 hover:text-error"
              onClick={() => onDelete(comment._id)}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Inline reply input */}
        {showReplyInput && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
              placeholder="Write a reply..."
              className="input input-bordered input-sm flex-1"
              autoFocus
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleReplySubmit}
              disabled={!replyContent.trim()}
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 ml-2 pl-4 border-l-2 border-base-300 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onReply={onReply}
                onDelete={onDelete}
                onUpvote={onUpvote}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DiscussionSection = ({ problemId }) => {
  const {
    discussions,
    isLoading,
    getDiscussions,
    createDiscussion,
    deleteDiscussion,
    toggleUpvote,
    updateDiscussion,
  } = useDiscussionStore();
  const { authUser } = useAuthStore();
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (problemId) {
      getDiscussions(problemId);
    }
  }, [problemId, getDiscussions]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setIsPosting(true);
    const result = await createDiscussion(problemId, newComment.trim());
    if (result) {
      setNewComment("");
      getDiscussions(problemId); // Refresh
    }
    setIsPosting(false);
  };

  const handleReply = async (parentId, content) => {
    const result = await createDiscussion(problemId, content, parentId);
    if (result) {
      getDiscussions(problemId); // Refresh
    }
  };

  const handleDelete = async (discussionId) => {
    const success = await deleteDiscussion(discussionId);
    if (success) {
      getDiscussions(problemId); // Refresh
    }
  };

  const handleEdit = async (discussionId, content) => {
    const result = await updateDiscussion(discussionId, content);
    if (result) {
      getDiscussions(problemId); // Refresh
    }
  };

  const handleUpvote = async (discussionId) => {
    return await toggleUpvote(discussionId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New comment input */}
      <div className="flex gap-3">
        <UserAvatar user={authUser} />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, approach, or ask a question..."
            className="textarea textarea-bordered w-full min-h-[80px] text-sm"
            maxLength={5000}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-base-content/50">
              {newComment.length}/5000
            </span>
            <button
              className={`btn btn-primary btn-sm gap-2 ${
                isPosting ? "loading" : ""
              }`}
              onClick={handlePost}
              disabled={!newComment.trim() || isPosting}
            >
              {!isPosting && <Send className="w-4 h-4" />}
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="divider">
        <MessageSquare className="w-4 h-4" />
        {discussions.length}{" "}
        {discussions.length === 1 ? "Discussion" : "Discussions"}
      </div>

      {/* Discussions list */}
      {discussions.length === 0 ? (
        <div className="text-center py-8 text-base-content/50">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No discussions yet</p>
          <p className="text-sm">Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {discussions.map((discussion) => (
            <CommentItem
              key={discussion._id}
              comment={discussion}
              currentUserId={authUser?._id}
              isAdmin={authUser?.role === "ADMIN"}
              onReply={handleReply}
              onDelete={handleDelete}
              onUpvote={handleUpvote}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionSection;
