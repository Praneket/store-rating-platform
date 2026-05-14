require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const storeRoutes = require("./routes/store.routes");
const ratingRoutes = require("./routes/rating.routes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
