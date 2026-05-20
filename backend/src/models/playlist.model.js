import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

playlistSchema.index({ name: 1, userId: 1 }, { unique: true });

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
