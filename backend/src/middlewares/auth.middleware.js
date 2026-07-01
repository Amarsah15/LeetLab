import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.id).select(
      "name email role image",
    );

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Forbidden - You are not an admin" });
  }
  next();
};
