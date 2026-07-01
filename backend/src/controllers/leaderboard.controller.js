import ProblemSolved from "../models/problemSolved.model.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await ProblemSolved.aggregate([
      // Group by userId and count problems solved
      {
        $group: {
          _id: "$userId",
          problemsSolved: { $sum: 1 },
        },
      },
      // Sort by problems solved descending
      { $sort: { problemsSolved: -1 } },
      // Limit to top 100
      { $limit: 100 },
      // Join with User collection to get name and image
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // Unwind the user array (each group has exactly one user)
      { $unwind: "$user" },
      // Project the fields we need
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          image: "$user.image",
          problemsSolved: 1,
        },
      },
    ]);

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully",
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal server error in getLeaderboard" });
  }
};
