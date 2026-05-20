import mongoose from "mongoose";

const testCaseResultSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },
    testCase: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    stdout: { type: String, default: null },
    expected: { type: String, required: true },
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

testCaseResultSchema.index({ submissionId: 1 });

const TestCaseResult = mongoose.model("TestCaseResult", testCaseResultSchema);
export default TestCaseResult;
