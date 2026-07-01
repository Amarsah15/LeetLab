import cloudinary from "../libs/cloudinary.js";
import User from "../models/user.model.js";

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const userId = req.user._id;

    // Delete old image from Cloudinary if exists
    const currentUser = await User.findById(userId);
    if (currentUser.image) {
      // Extract public_id from Cloudinary URL
      const urlParts = currentUser.image.split("/");
      const filenameWithExt = urlParts[urlParts.length - 1];
      const publicId = `leetlab/avatars/${filenameWithExt.split(".")[0]}`;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        // Non-critical — old image cleanup failed, continue anyway
        console.warn("Failed to delete old Cloudinary image:", err.message);
      }
    }

    // Upload new image from buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "leetlab/avatars",
          transformation: [
            { width: 256, height: 256, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user's image field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: result.secure_url },
      { new: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res
      .status(500)
      .json({ error: "Internal server error in uploadProfileImage" });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    const currentUser = await User.findById(userId);
    if (!currentUser.image) {
      return res.status(400).json({ error: "No profile image to remove" });
    }

    // Delete from Cloudinary
    const urlParts = currentUser.image.split("/");
    const filenameWithExt = urlParts[urlParts.length - 1];
    const publicId = `leetlab/avatars/${filenameWithExt.split(".")[0]}`;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn("Failed to delete Cloudinary image:", err.message);
    }

    // Clear image field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: null },
      { new: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error removing profile image:", error);
    res
      .status(500)
      .json({ error: "Internal server error in removeProfileImage" });
  }
};
