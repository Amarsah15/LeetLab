import React from "react";
import { useForm } from "react-hook-form";
import { X, FolderPlus } from "lucide-react";

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up duration-150">
      <div className="glass-card bg-base-100/95 border border-base-content/10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-base-content/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Create New Playlist</h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-content/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-5"
        >
          {/* Playlist Name */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-base-content/60 px-1">
              Playlist Name
            </label>
            <input
              type="text"
              className="input input-bordered glass-input w-full text-sm rounded-lg"
              placeholder="Enter playlist name"
              {...register("name", { required: "Playlist name is required" })}
            />
            {errors.name && (
              <span className="text-error text-xs px-1 mt-0.5">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-base-content/60 px-1">
              Description
            </label>
            <textarea
              className="textarea textarea-bordered glass-input h-24 text-sm rounded-lg w-full"
              placeholder="Enter playlist description"
              {...register("description")}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-base-content/5">
            <button
              type="submit"
              className="btn btn-gradient w-full py-2.5 text-sm flex items-center justify-center gap-2 rounded-lg font-bold"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
