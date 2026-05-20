import Problem from "../models/problem.model.js";
import ProblemSolved from "../models/problemSolved.model.js";
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

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You are not authorized" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: "Invalid language" });
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
    }
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

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You are not authorized" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: "Invalid language" });
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

      const newProblem = await Problem.findByIdAndUpdate(
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

      return res.status(201).json({
        success: true,
        message: "Problem updated successfully",
        newProblem,
      });
    }
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

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "You are not authorized" });
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
