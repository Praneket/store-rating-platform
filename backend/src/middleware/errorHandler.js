const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return errorResponse(res, `${field} already exists`, 409);
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return errorResponse(res, "Record not found", 404);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, "Token expired", 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return errorResponse(res, message, statusCode);
};

const notFound = (req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = { errorHandler, notFound };
