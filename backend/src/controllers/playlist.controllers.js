import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Name field is required" });
    }

    // Create a new playlist
    const newPlaylist = await Playlist.create({
      name,
      description,
      userId,
    });

    res.status(201).json({
      sucess: true,
      message: "Playlist created successfully",
      newPlaylist,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res
      .status(500)
      .json({ message: "Internal server error in createPlaylist" });
  }
};

export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true, // Include the problem details
          },
        }, // Include the problems associated with the playlist
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlists retrieved successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error retrieving playlists:", error);
    res
      .status(500)
      .json({ message: "Internal server error in getAllListDetails" });
  }
};

export const getPlaylistDetails = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true, // Include the problem details
          },
        }, // Include the problems associated with the playlist
      },
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      message: "Playlist retrieved successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error retrieving playlist:", error);
    res
      .status(500)
      .json({ message: "Internal server error in getPlaylistDetails" });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ message: "Problem IDs are required" });
    }

    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problem to playlist:", error);
    res.status(500).json({
      message: "Internal server error in addProblemToPlaylist",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      deletedPlaylist,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({
      message: "Internal server error in deletePlaylist",
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ message: "Problem IDs are required" });
    }

    const deletedProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems removed from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist:", error);
    res.status(500).json({
      message: "Internal server error in removeProblemFromPlaylist",
    });
  }
};
