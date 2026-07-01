import { Mail, User, EyeOff, Eye, Camera, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import React, { useState, useRef } from "react";
import ChangePasswordPopup from "../profile/ChangePasswordPopup";
import { motion } from "framer-motion";

const Profile = ({ onOpenChangePassword }) => {
  const { authUser, uploadProfileImage, removeProfileImage } = useAuthStore();
  const fileInputRef = useRef(null);

  const getInitials = (name = "Profile") => {
    const words = name.trim().split(" ");
    const initials =
      words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];
    return initials.toUpperCase();
  };

  const [isHidden, setIsHidden] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await uploadProfileImage(file);
    setIsUploading(false);
  };

  const handleRemoveImage = async () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      await removeProfileImage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-base-200 border border-base-content/10 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <motion.button
              onClick={handleImageClick}
              disabled={isUploading}
              className="relative block rounded-full overflow-hidden ring-2 ring-primary/30 hover:ring-primary/80 transition-all duration-200 cursor-pointer ring-offset-2 ring-offset-base-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isUploading ? (
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-base-300">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              ) : authUser?.image ? (
                <img
                  src={authUser.image}
                  alt={authUser.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                  {getInitials(authUser?.name)}
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white rounded-full cursor-pointer">
                <Camera className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-0.5">Upload</span>
              </div>
            </motion.button>
          </div>

          {/* Name & actions */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">{authUser?.name}</h2>
            {authUser?.image && (
              <button
                onClick={handleRemoveImage}
                className="btn btn-xs btn-outline border-error/25 hover:border-error/70 hover:bg-error/5 text-error/65 hover:text-error gap-1.5 mt-2.5 -ml-1 transition-all duration-200"
              >
                <Trash2 className="w-3 h-3" />
                Remove Photo
              </button>
            )}
          </div>
        </div>

        <div className="gradient-divider my-6" />

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="bg-base-300/50 border border-base-content/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-base-content/40 font-medium">Email</p>
              <p className="text-sm font-semibold truncate">{authUser.email}</p>
            </div>
          </div>

          {/* User ID */}
          <div className="bg-base-300/50 border border-base-content/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs text-base-content/40 font-medium">
                  User ID
                </p>
                <button
                  className="text-base-content/30 hover:text-base-content/60 transition-colors"
                  onClick={() => setIsHidden(!isHidden)}
                  aria-label="Toggle User ID visibility"
                >
                  {isHidden ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm font-semibold font-mono truncate">
                {isHidden ? "••••••••••••••••••••••••" : authUser._id}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <motion.button
            className="btn-gradient btn btn-sm font-semibold"
            onClick={onOpenChangePassword}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Change Password
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
