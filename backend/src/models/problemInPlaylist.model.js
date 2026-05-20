import mongoose from "mongoose";

const problemInPlaylistSchema = new mongoose.Schema(
  {
    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

problemInPlaylistSchema.index(
  { playlistId: 1, problemId: 1 },
  { unique: true },
);

const ProblemInPlaylist = mongoose.model(
  "ProblemInPlaylist",
  problemInPlaylistSchema,
);
export default ProblemInPlaylist;
