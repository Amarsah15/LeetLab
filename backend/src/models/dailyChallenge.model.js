import mongoose from "mongoose";

const dailyChallengeSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    date: {
      type: String, // format "YYYY-MM-DD"
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const DailyChallenge = mongoose.model("DailyChallenge", dailyChallengeSchema);
export default DailyChallenge;
