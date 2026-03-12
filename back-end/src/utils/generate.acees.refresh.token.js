import User from "../models/users.models.js";

const generateTokens = async (Model, id) => {
  try {
    const doc = await Model.findById(id);
    const accessToken = doc.generateAccessToken();
    const refreshToken = doc.generateRefreshToken();
    doc.refreshToken = refreshToken;
    await doc.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch {
    return {
      status: 500,
      success: false,
      message: "Something went wrong while generating access token and refresh token",
    };
  }
};

const generateAccessAndRefreshTokenUser = (id) => generateTokens(User, id);

export {
  generateAccessAndRefreshTokenUser,
};
