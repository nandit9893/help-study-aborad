import jwt from "jsonwebtoken";
import User from "../models/users.models.js";

const verifyUserJWT = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
    }).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User not found.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    let message = "Access denied. Invalid token.";

    if (error.name === "TokenExpiredError") {
      message = "Access denied. Token has expired.";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export default verifyUserJWT;
