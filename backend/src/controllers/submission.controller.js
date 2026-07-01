import Submission from "../models/submission.model.js";

export const getAllSubmission = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const getSubmissionsForProblem = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.problemId;

    const submissions = await Submission.find({ userId, problemId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const count = await Submission.countDocuments({ problemId });

    res.status(200).json({
      success: true,
      message: "Submissions Fetched successfully",
      count,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const getSuccessRate = async (req, res) => {
  try {
    const { problemId } = req.params;

    const totalSubmissions = await Submission.countDocuments({ problemId });
    const acceptedSubmissions = await Submission.countDocuments({
      problemId,
      status: "Accepted",
    });

    const successRate =
      totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
        : 0;

    res.json({
      totalSubmissions,
      acceptedSubmissions,
      successRate: parseFloat(successRate),
    });
  } catch (error) {
    console.error("Error fetching success rate:", error);
    res.status(500).json({ error: "Failed to fetch success rate" });
  }
};
