const prisma = require("../config/database");

const buildUserWhere = ({ search, role }) => {
  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }
  return where;
};

const getAllUsers = async ({ page = 1, limit = 10, search, role, sortBy = "createdAt", sortOrder = "desc" }) => {
  const skip = (page - 1) * limit;
  const where = buildUserWhere({ search, role });

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        ownedStore: { select: { id: true, name: true, ratings: { select: { value: true } } } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const usersWithRating = users.map((u) => {
    const ratings = u.ownedStore?.ratings || [];
    const avgRating = ratings.length
      ? (ratings.reduce((s, r) => s + r.value, 0) / ratings.length).toFixed(1)
      : null;
    return { ...u, storeRating: avgRating };
  });

  return { users: usersWithRating, total };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      ownedStore: {
        select: {
          id: true,
          name: true,
          address: true,
          ratings: { select: { value: true, user: { select: { name: true, email: true } } } },
        },
      },
    },
  });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const ratings = user.ownedStore?.ratings || [];
  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + r.value, 0) / ratings.length).toFixed(1)
    : null;

  return { ...user, storeRating: avgRating };
};

const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
};

module.exports = { getAllUsers, getUserById, getDashboardStats };
