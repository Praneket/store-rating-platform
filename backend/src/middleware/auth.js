const { verifyAccessToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/response");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Access token required", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Access token expired", 401);
    }
    return errorResponse(res, "Invalid access token", 401);
  }
};

module.exports = { authenticate };
