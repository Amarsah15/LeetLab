import Playlist from "../models/playlist.model.js";
import ProblemInPlaylist from "../models/problemInPlaylist.model.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    const playList = await Playlist.create({ name, description, userId });

    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playList,
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
    // Return plain JS objects so frontend doesn't receive Mongoose internals
    const playlists = await Playlist.find({ userId: req.user._id }).lean();

    // Attach problems for each playlist
    const playlistIds = playlists.map((p) => p._id);
    const problemsInPlaylists = await ProblemInPlaylist.find({
      playlistId: { $in: playlistIds },
    })
      .populate("problemId")
      .lean();

    const playlistsWithProblems = playlists.map((playlist) => ({
      ...playlist,
      problems: problemsInPlaylists
        .filter((pip) => pip.playlistId.toString() === playlist._id.toString())
        .map((pip) => ({
          ...pip,
          problem: pip.problemId,
        })),
    }));

    res.status(200).json({
      success: true,
      message: "Playlists retrieved successfully",
      playlists: playlistsWithProblems,
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

    const playlist = await Playlist.findOne({
      _id: playlistId,
      userId: req.user._id,
    }).lean();

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const problems = await ProblemInPlaylist.find({ playlistId })
      .populate("problemId")
      .lean();

    res.status(200).json({
      success: true,
      message: "Playlist retrieved successfully",
      playlist: {
        ...playlist,
        problems: problems.map((pip) => ({
          ...pip,
          problem: pip.problemId,
        })),
      },
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

    const docs = problemIds.map((problemId) => ({ playlistId, problemId }));
    const problemsInPlaylist = await ProblemInPlaylist.insertMany(docs, {
      ordered: false, // skip duplicates (unique index violations)
    }).catch((err) => {
      // If all were duplicates, err.insertedDocs may still be partial — that's fine
      if (err.code === 11000) return err.insertedDocs ?? [];
      throw err;
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problem to playlist:", error);
    res
      .status(500)
      .json({ message: "Internal server error in addProblemToPlaylist" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId).lean();

    // Cascade-delete junction records (MongoDB doesn't do this automatically)
    await ProblemInPlaylist.deleteMany({ playlistId });

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      deletedPlaylist,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res
      .status(500)
      .json({ message: "Internal server error in deletePlaylist" });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ message: "Problem IDs are required" });
    }

    const deletedProblem = await ProblemInPlaylist.deleteMany({
      playlistId,
      problemId: { $in: problemIds },
    });

    res.status(200).json({
      success: true,
      message: "Problems removed from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist:", error);
    res
      .status(500)
      .json({ message: "Internal server error in removeProblemFromPlaylist" });
  }
};
