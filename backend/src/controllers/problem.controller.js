import Problem from "../models/problem.model.js";
import ProblemSolved from "../models/problemSolved.model.js";
import DailyChallenge from "../models/dailyChallenge.model.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    // Validate ALL reference solutions before creating the problem
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: `Invalid language: ${language}` });
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionsResults = await submitBatch(submissions);
      const tokens = submissionsResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Test case ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    // All languages validated — now create the problem
    const newProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      constraints,
      examples,
      testCases,
      codeSnippets,
      referenceSolutions,
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      newProblem,
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    // Use lean() so we return plain JS objects (not Mongoose Documents).
    const problems = await Problem.find().lean();

    // Attach solvedBy for the current user
    const solvedByUser = await ProblemSolved.find({
      userId: req.user._id,
    }).lean();
    const solvedProblemIds = new Set(
      solvedByUser.map((s) => s.problemId.toString()),
    );

    const problemsWithSolved = problems.map((p) => ({
      ...p,
      solvedBy: solvedProblemIds.has(p._id.toString())
        ? [{ userId: req.user._id, problemId: p._id }]
        : [],
    }));

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems: problemsWithSolved,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return res
      .status(500)
      .json({ error: "Internal server error in getAllProblems" });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return res
      .status(500)
      .json({ error: "Internal server error in getProblemById" });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid problem id" });
  }

  const problem = await Problem.findById(id);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }

  const {
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    // Validate ALL reference solutions before updating the problem
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: `Invalid language: ${language}` });
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionsResults = await submitBatch(submissions);
      const tokens = submissionsResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Test case ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    // All languages validated — now update the problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        tags,
        constraints,
        examples,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: req.user._id,
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    return res
      .status(500)
      .json({ error: "Internal server error in updateProblem" });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid problem id" });
  }

  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    await Problem.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res
      .status(500)
      .json({ error: "Internal server error in deleteProblem" });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const solvedEntries = await ProblemSolved.find({ userId: req.user._id });
    const solvedProblemIds = solvedEntries.map((s) => s.problemId);

    const problems = await Problem.find({ _id: { $in: solvedProblemIds } });

    const problemsWithSolved = problems.map((p) => ({
      ...p,
      solvedBy: [{ userId: req.user._id, problemId: p._id }],
    }));

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems: problemsWithSolved,
    });
  } catch (error) {
    console.error("Error fetching problems solved by user:", error);
    return res.status(500).json({
      error: "Internal server error in getAllProblemsSolvedByUser",
    });
  }
};

const getISTDateString = () => {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const dateParts = {};
  parts.forEach((p) => {
    if (p.type !== "literal") {
      dateParts[p.type] = p.value;
    }
  });
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

export const getDailyChallenge = async (req, res) => {
  try {
    const todayStr = getISTDateString();
    
    // Check if we already have a daily challenge for today
    let daily = await DailyChallenge.findOne({ date: todayStr }).populate("problemId");
    
    if (!daily) {
      // Find all problems in the database
      const problems = await Problem.find({}, "_id");
      if (problems.length === 0) {
        return res.status(404).json({ error: "No problems found in the database to set as daily challenge" });
      }
      
      // Randomly select one problem
      const randomIndex = Math.floor(Math.random() * problems.length);
      const selectedProblem = problems[randomIndex];
      
      // Create new DailyChallenge document
      // Use findOneAndUpdate with upsert: true to prevent race conditions if multiple requests hit concurrently
      daily = await DailyChallenge.findOneAndUpdate(
        { date: todayStr },
        { $setOnInsert: { problemId: selectedProblem._id } },
        { new: true, upsert: true, runValidators: true }
      ).populate("problemId");
    }
    
    if (!daily || !daily.problemId) {
      return res.status(404).json({ error: "Daily challenge problem not found" });
    }

    const problemObj = daily.problemId.toObject();
    
    // Count all users who solved this problem
    const totalSolvedCount = await ProblemSolved.countDocuments({ problemId: problemObj._id });
    
    // Check if the current user solved this problem
    const isSolvedByCurrentUser = await ProblemSolved.findOne({
      userId: req.user._id,
      problemId: problemObj._id,
    });

    const solvedBy = [];
    if (isSolvedByCurrentUser) {
      solvedBy.push({ userId: req.user._id, problemId: problemObj._id });
    }
    // Fill the rest with dummy items to reflect total solved count for length check
    while (solvedBy.length < totalSolvedCount) {
      solvedBy.push({ userId: new mongoose.Types.ObjectId(), problemId: problemObj._id });
    }

    const problemWithSolved = {
      ...problemObj,
      solvedBy,
    };
    
    return res.status(200).json({
      success: true,
      message: "Daily challenge retrieved successfully",
      dailyChallenge: problemWithSolved,
    });
  } catch (error) {
    console.error("Error getting daily challenge:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
