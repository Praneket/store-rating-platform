const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response");

const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    return successResponse(res, user, "Account created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return successResponse(res, { user, accessToken }, "Login successful");
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return errorResponse(res, "Refresh token required", 401);
    const { accessToken } = await authService.refreshAccessToken(token);
    return successResponse(res, { accessToken }, "Token refreshed");
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    await authService.logout(token);
    res.clearCookie("refreshToken");
    return successResponse(res, null, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    await authService.updatePassword(req.user.id, req.body);
    return successResponse(res, null, "Password updated successfully");
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res) => {
  return successResponse(res, req.user, "Profile fetched");
};

module.exports = { signup, login, refresh, logout, updatePassword, getMe };
