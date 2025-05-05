import { db } from "../libs/db.js";

export const getAllSubmission = async (req, res) => {
  try {
    const userId = req.user.id;

    const submission = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "All submission fetched successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Internal server error while fetching submission in getAllSubmission",
      error: error.message,
    });
  }
};

export const getSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;
    const submission = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Internal server error while fetching submission in getSubmissionForProblem",
      error: error.message,
    });
  }
};

export const getAllTheSubmissionForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submission = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Submission count fetched successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Internal server error while fetching submission in getAllTheSubmissionForProblem",
      error: error.message,
    });
  }
};
