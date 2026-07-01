import User from "../models/user.model.js";
import Problem from "../models/problem.model.js";
import Submission from "../models/submission.model.js";
import mongoose from "mongoose";

export const getAnalytics = async (req, res) => {
  try {
    // 1. Core count statistics
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    // 2. Language distribution
    const languageStats = await Submission.aggregate([
      { $group: { _id: "$language", count: { $sum: 1 } } },
    ]);
    const languageDistribution = languageStats.reduce((acc, curr) => {
      acc[curr._id || "Unknown"] = curr.count;
      return acc;
    }, {});

    // 3. Status distribution
    const statusStats = await Submission.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusDistribution = statusStats.reduce((acc, curr) => {
      acc[curr._id || "Unknown"] = curr.count;
      return acc;
    }, {});

    // 4. Daily Submissions in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Submission.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 5. Active users (Top 5 users with highest streak and submissions)
    const activeUsers = await User.find({})
      .select("name email currentStreak maxStreak image")
      .sort({ currentStreak: -1 })
      .limit(5);

    // 6. System health metrics (Avg execution time)
    const submissionTimes = await Submission.find({
      time: { $ne: null },
    }).select("time");
    let totalExecTime = 0;
    let validExecCount = 0;

    submissionTimes.forEach((sub) => {
      // Parse execution time list or single value
      try {
        const parsedTime = JSON.parse(sub.time);
        if (Array.isArray(parsedTime)) {
          parsedTime.forEach((t) => {
            const timeNum = parseFloat(t);
            if (!isNaN(timeNum)) {
              totalExecTime += timeNum;
              validExecCount++;
            }
          });
        } else {
          const timeNum = parseFloat(sub.time);
          if (!isNaN(timeNum)) {
            totalExecTime += timeNum;
            validExecCount++;
          }
        }
      } catch (e) {
        const timeNum = parseFloat(sub.time);
        if (!isNaN(timeNum)) {
          totalExecTime += timeNum;
          validExecCount++;
        }
      }
    });

    const averageExecutionTime =
      validExecCount > 0
        ? `${(totalExecTime / validExecCount).toFixed(3)}s`
        : "0.000s";

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalProblems,
          totalSubmissions,
        },
        languageDistribution,
        statusDistribution,
        dailySubmissions: dailyStats,
        activeUsers,
        systemMetrics: {
          dbConnection:
            mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
          averageExecutionTime,
          nodeUptime: `${Math.floor(process.uptime())}s`,
        },
      },
    });
  } catch (error) {
    console.error("Error in getAnalytics controller:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
