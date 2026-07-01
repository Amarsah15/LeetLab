import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    sourceCode: { type: mongoose.Schema.Types.Mixed, required: true },
    language: { type: String, required: true },
    stdin: { type: String, default: null },
    stdout: { type: String, default: null },
    stderr: { type: String, default: null },
    compileOutput: { type: String, default: null },
    status: { type: String, required: true },
    memory: { type: String, default: null },
    time: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ problemId: 1, status: 1 });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
