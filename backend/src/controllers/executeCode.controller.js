import Submission from "../models/submission.model.js";
import TestCaseResult from "../models/testCaseResult.model.js";
import ProblemSolved from "../models/problemSolved.model.js";
import User from "../models/user.model.js";
import { syncUserStreak } from "../libs/streak.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.libs.js";

export const executeCode = async (req, res) => {
  try {
    const {
      source_code,
      language_id,
      stdin,
      expected_outputs,
      problemId,
      mode = "submit",
    } = req.body;
    const userId = req.user._id;

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missing test cases." });
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    const results = await pollBatchResults(tokens);

    let allPassed = true;
    let detailedResults = results.map((result, index) => {
      const expected_output = expected_outputs[index]?.trim();
      const stdout = result.stdout?.trim();
      const passed = expected_output === stdout;

      if (!passed) allPassed = false;

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expected_output,
        input: stdin[index],
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} seconds` : undefined,
      };
    });

    // "run" mode: return results without saving to database
    if (mode === "run") {
      return res.status(200).json({
        success: true,
        message: "Code ran successfully",
        submission: {
          mode: "run",
          status: allPassed ? "Accepted" : "Wrong Answer",
          language: getLanguageName(language_id),
          memory: JSON.stringify(detailedResults.map((r) => r.memory)),
          time: JSON.stringify(detailedResults.map((r) => r.time)),
          testCases: detailedResults,
        },
      });
    }

    // "submit" mode: save submission, test case results, and mark problem solved
    const submission = await Submission.create({
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compile_output)
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: detailedResults.some((r) => r.memory)
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      time: detailedResults.some((r) => r.time)
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
    });

    if (allPassed) {
      await ProblemSolved.findOneAndUpdate(
        { userId, problemId },
        { userId, problemId },
        { upsert: true, new: true },
      );
    }

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission._id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      input: result.input,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await TestCaseResult.insertMany(testCaseResults);

    // Update streak dynamically based on submission history
    const updatedUser = await syncUserStreak(userId);

    const submissionWithTestCases = await Submission.findById(
      submission._id,
    ).lean();
    const testCases = await TestCaseResult.find({
      submissionId: submission._id,
    }).lean();

    res.status(200).json({
      success: true,
      message: "Code submitted successfully",
      submission: { ...submissionWithTestCases, testCases },
      user: updatedUser
        ? {
            currentStreak: updatedUser.currentStreak,
            maxStreak: updatedUser.maxStreak,
          }
        : null,
    });
  } catch (error) {
    console.error("executeCode error:", error);
    res.status(500).json({ error: "Internal server error in executeCode" });
  }
};
