const storeService = require("../services/store.service");
const { successResponse, paginatedResponse } = require("../utils/response");

const getAllStores = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = req.query;
    const userId = req.user?.role === "USER" ? req.user.id : undefined;
    const { stores, total } = await storeService.getAllStores({ page, limit, search, sortBy, sortOrder, userId });
    return paginatedResponse(res, stores, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const store = await storeService.getStoreById(req.params.id, userId);
    return successResponse(res, store);
  } catch (err) {
    next(err);
  }
};

const createStore = async (req, res, next) => {
  try {
    const store = await storeService.createStore(req.body);
    return successResponse(res, store, "Store created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const updateStore = async (req, res, next) => {
  try {
    const store = await storeService.updateStore(req.params.id, req.body);
    return successResponse(res, store, "Store updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteStore = async (req, res, next) => {
  try {
    await storeService.deleteStore(req.params.id);
    return successResponse(res, null, "Store deleted successfully");
  } catch (err) {
    next(err);
  }
};

const getOwnerDashboard = async (req, res, next) => {
  try {
    const store = await storeService.getOwnerDashboard(req.user.id);
    return successResponse(res, store);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStores, getStoreById, createStore, updateStore, deleteStore, getOwnerDashboard };
