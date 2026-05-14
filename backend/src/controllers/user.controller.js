const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const { successResponse, paginatedResponse } = require("../utils/response");

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, sortBy, sortOrder } = req.query;
    const { users, total } = await userService.getAllUsers({ page, limit, search, role, sortBy, sortOrder });
    return paginatedResponse(res, users, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    return successResponse(res, user, "User created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await userService.getDashboardStats();
    return successResponse(res, stats);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, createUser, getDashboardStats };
