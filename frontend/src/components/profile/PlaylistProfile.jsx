import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../../store/usePlaylistStore";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  List,
  Tag,
  ExternalLink,
  Trash2,
} from "lucide-react";
import AddToPlaylistModal from "../AddToPlaylist";

const PlaylistProfile = ({ onOpenCreatePlaylist }) => {
  const {
    getAllPlaylists,
    playlists,
    deletePlaylist,
    removeProblemFromPlaylist,
  } = usePlaylistStore();
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  const togglePlaylist = (id) => {
    if (expandedPlaylist === id) {
      setExpandedPlaylist(null);
    } else {
      setExpandedPlaylist(id);
    }
  };

  const handleDelete = async (id) => {
    await deletePlaylist(id);
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return <span className="badge badge-success">Easy</span>;
      case "MEDIUM":
        return <span className="badge badge-warning">Medium</span>;
      case "HARD":
        return <span className="badge badge-error">Hard</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Title */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-base-content/85 flex items-center gap-2">
          <List className="w-5 h-5 text-primary" />
          My Playlists
        </h2>
        <button
          className="btn btn-sm btn-gradient font-bold text-xs shadow-sm hover:scale-105 transition-all duration-200"
          onClick={onOpenCreatePlaylist}
        >
          Create Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 p-8 text-center rounded-2xl shadow-xl">
          <h3 className="text-base font-semibold text-base-content/70 mb-1">
            No playlists found
          </h3>
          <p className="text-xs text-base-content/40 mb-4">
            Create your first playlist to organize problems!
          </p>
          <button
            className="btn btn-sm btn-gradient font-semibold"
            onClick={onOpenCreatePlaylist}
          >
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="p-4">
                {/* Playlist Header */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => togglePlaylist(playlist._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder flex items-center justify-center">
                      <div className="bg-primary/10 text-primary rounded-lg w-10 h-10 flex items-center justify-center">
                        <BookOpen size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-base-content/85">
                        {playlist.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-base-content/40">
                        <div className="flex items-center gap-1 font-medium">
                          <Clock size={12} />
                          <span>Created {formatDate(playlist.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="text-base-content/40 hover:text-base-content/80 transition-colors">
                    {expandedPlaylist === playlist._id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>

                {/* Description */}
                {playlist.description && (
                  <p className="text-xs text-base-content/65 mt-2.5 leading-relaxed pl-1">
                    {playlist.description}
                  </p>
                )}

                {/* Expanded Problems List */}
                {expandedPlaylist === playlist._id && (
                  <div className="mt-4 pt-4 border-t border-base-content/5">
                    <h4 className="text-sm font-semibold text-base-content/75 mb-3">
                      Problems in this playlist
                    </h4>

                    {playlist.problems.length === 0 ? (
                      <div className="bg-[#181824] p-4 text-center border border-white/5 rounded-xl text-xs text-base-content/40">
                        <span>No problems added to this playlist yet.</span>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-base-content/5">
                        <table className="table table-zebra w-full text-xs">
                          <thead>
                            <tr className="bg-base-200/50 text-[10px] text-base-content/50 uppercase tracking-wider font-semibold border-b border-base-content/5">
                              <th className="py-2.5">Problem</th>
                              <th className="py-2.5">Difficulty</th>
                              <th className="py-2.5">Tags</th>
                              <th className="py-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-base-content/5">
                            {playlist.problems.map((item) => (
                              <tr
                                key={item._id}
                                className="hover:bg-base-200/20 transition-colors"
                              >
                                <td className="font-medium text-base-content/80 py-3">
                                  {item.problem.title}
                                </td>
                                <td className="py-3">
                                  {getDifficultyBadge(item.problem.difficulty)}
                                </td>
                                <td className="py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {item.problem.tags &&
                                      item.problem.tags
                                        .slice(0, 3)
                                        .map((tag, idx) => (
                                          <div
                                            key={idx}
                                            className="badge badge-outline badge-sm text-[10px] py-0.5 px-1.5 opacity-70"
                                          >
                                            {tag}
                                          </div>
                                        ))}
                                  </div>
                                </td>
                                <td className="py-3 text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Link
                                      to={`/problem/${item.problem._id}`}
                                      className="btn btn-xs btn-ghost bg-base-200/50 border border-base-content/10 text-[10px]"
                                    >
                                      Solve
                                    </Link>
                                    <button
                                      onClick={() =>
                                        removeProblemFromPlaylist(
                                          playlist._id,
                                          [item.problem._id],
                                        )
                                      }
                                      className="btn btn-xs btn-ghost text-error/60 hover:text-error hover:bg-error/10 text-[10px]"
                                      title="Remove from playlist"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleDelete(playlist._id)}
                        className="btn btn-xs btn-ghost text-error/60 hover:text-error hover:bg-error/10 text-[10px] font-semibold"
                      >
                        Delete Playlist
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistProfile;
