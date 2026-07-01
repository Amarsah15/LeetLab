import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
      default: null,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

discussionSchema.index({ problemId: 1, createdAt: -1 });
discussionSchema.index({ parentId: 1 });

const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;
