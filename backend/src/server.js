require("dotenv").config();
const app = require("./app");
const prisma = require("./config/database");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("✅ Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  shutdown("unhandledRejection");
});
