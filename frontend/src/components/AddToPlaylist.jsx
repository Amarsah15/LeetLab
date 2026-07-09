import React, { useEffect, useState } from "react";
import { X, Plus, Loader, ChevronDown } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";

const AddToPlaylistModal = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } =
    usePlaylistStore();

  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 animate-fade-in-up duration-150">
      <div className="bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white">Add to Playlist</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle hover:bg-white/5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-slate-400 px-1">
              Select Playlist
            </label>
            <div className="relative w-full">
              <select
                className="select select-bordered w-full pr-10 text-[15px] sm:text-base rounded-lg cursor-pointer bg-[#0a0a0f] border-white/10 focus:border-primary/50 text-white focus:outline-none"
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
                disabled={isLoading}
              >
                <option value="" className="bg-gradient-to-br from-[#16142c] to-[#0d0c1b] text-white">Select a playlist</option>
                {playlists.map((playlist) => (
                  <option key={playlist._id} value={playlist._id} className="bg-gradient-to-br from-[#16142c] to-[#0d0c1b] text-white">
                    {playlist.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 text-[15px] font-semibold text-slate-350 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-6 font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-[15px] bg-primary hover:bg-primary/90 text-white disabled:opacity-100 disabled:bg-white/5 disabled:text-white/20 disabled:border-white/5 cursor-pointer"
              disabled={!selectedPlaylist || isLoading}
            >
              {isLoading ? (
                <Loader className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <Plus className="w-4.5 h-4.5" />
              )}
              Add to Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
