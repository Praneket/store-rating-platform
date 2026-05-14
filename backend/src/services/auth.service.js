const bcrypt = require("bcrypt");
const prisma = require("../config/database");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} = require("../utils/jwt");

const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);

const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name,
});

const signup = async ({ name, email, password, address, role = "USER" }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, address, role },
    select: { id: true, name: true, email: true, role: true, address: true, createdAt: true },
  });

  return user;
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const payload = buildTokenPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    const err = new Error("Invalid or expired refresh token");
    err.statusCode = 401;
    throw err;
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = generateAccessToken(buildTokenPayload(user));
  return { accessToken };
};

const logout = async (refreshToken) => {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) {
    const err = new Error("Current password is incorrect");
    err.statusCode = 400;
    throw err;
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  // Invalidate all refresh tokens on password change
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

module.exports = { signup, login, refreshAccessToken, logout, updatePassword };
