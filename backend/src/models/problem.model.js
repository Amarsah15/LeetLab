import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
    },
    tags: { type: [String], default: [] },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examples: { type: mongoose.Schema.Types.Mixed, required: true },
    constraints: { type: String, required: true },
    hints: { type: String, default: null },
    editorial: { type: String, default: null },
    testCases: { type: mongoose.Schema.Types.Mixed, required: true },
    codeSnippets: { type: mongoose.Schema.Types.Mixed, required: true },
    referenceSolutions: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  },
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
