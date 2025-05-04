import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
  //get the data from the request body
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
  //going to check the user is admin or not
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You are not authorized" });
  }
  // // loop through each reference solution for different languages
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      // get the language id from the judge0 library
      const languageId = getJudge0LanguageId(language);

      // check if the language id is valid
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

      // if all test cases passed, save the problem to the database
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          constraints,
          examples,
          testCases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
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
    const problems = await db.problem.findMany();

    if (!problems || problems.length === 0) {
      return res.status(404).json({ error: "No problems found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
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
    const problem = await db.problem.findUnique({
      where: { id },
    });

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
  // get the problem id from the request params
  const { id } = req.params;
  // check if the problem id is valid
  if (!id) {
    return res.status(400).json({ error: "Invalid problem id" });
  }
  // check if the problem exists in the database
  const problem = await db.problem.findUnique({
    where: { id },
  });
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  //get the data from the request body
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
  //going to check the user is admin or not
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You are not authorized" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      // get the language id from the judge0 library
      const languageId = getJudge0LanguageId(language);

      // check if the language id is valid
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

      // if all test cases passed, save the problem to the database
      const newProblem = await db.problem.update({
        where: { id },
        data: {
          title,
          description,
          difficulty,
          tags,
          constraints,
          examples,
          testCases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Problem updated successfully",
        newProblem,
      });
    }
  } catch (error) {
    console.error("Error creating problem:", error);
    return res
      .status(500)
      .json({ error: "Internal server error in updateProblem" });
  }
};

export const deleteProblem = async (req, res) => {
  // get the problem id from the request params
  const { id } = req.params;
  // check if the problem id is valid
  if (!id) {
    return res.status(400).json({ error: "Invalid problem id" });
  }

  try {
    // check if the problem exists in the database
    const problem = await db.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    //going to check the user is admin or not
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "You are not authorized" });
    }
    await db.problem.delete({
      where: { id },
    });

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

export const getAllProblemsSolvedByUser = async (req, res) => {};
