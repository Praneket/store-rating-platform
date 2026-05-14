const ratingService = require("../services/rating.service");
const { successResponse } = require("../utils/response");

const submitRating = async (req, res, next) => {
  try {
    const rating = await ratingService.submitOrUpdateRating(req.user.id, req.body);
    return successResponse(res, rating, "Rating submitted successfully", 201);
  } catch (err) {
    next(err);
  }
};

const getMyRatings = async (req, res, next) => {
  try {
    const ratings = await ratingService.getUserRatings(req.user.id);
    return successResponse(res, ratings);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitRating, getMyRatings };
