const prisma = require("../config/database");

const buildStoreWhere = ({ search }) => {
  if (!search) return {};
  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ],
  };
};

const computeAvgRating = (ratings) => {
  if (!ratings.length) return null;
  return parseFloat((ratings.reduce((s, r) => s + r.value, 0) / ratings.length).toFixed(1));
};

const getAllStores = async ({ page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", userId }) => {
  const skip = (page - 1) * limit;
  const where = buildStoreWhere({ search });

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      include: {
        ratings: { select: { value: true, userId: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.store.count({ where }),
  ]);

  const storesWithRating = stores.map((store) => {
    const avgRating = computeAvgRating(store.ratings);
    const userRating = userId ? store.ratings.find((r) => r.userId === userId)?.value ?? null : undefined;
    const { ratings, ...rest } = store;
    return { ...rest, avgRating, totalRatings: ratings.length, ...(userId !== undefined && { userRating }) };
  });

  return { stores: storesWithRating, total };
};

const getStoreById = async (id, userId) => {
  const store = await prisma.store.findUnique({
    where: { id: Number(id) },
    include: {
      ratings: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  if (!store) {
    const err = new Error("Store not found");
    err.statusCode = 404;
    throw err;
  }

  const avgRating = computeAvgRating(store.ratings);
  const userRating = userId ? store.ratings.find((r) => r.userId === userId)?.value ?? null : null;

  return { ...store, avgRating, totalRatings: store.ratings.length, userRating };
};

const createStore = async (data) => {
  return prisma.store.create({
    data,
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
};

const updateStore = async (id, data) => {
  return prisma.store.update({
    where: { id: Number(id) },
    data,
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
};

const deleteStore = async (id) => {
  return prisma.store.delete({ where: { id: Number(id) } });
};

const getOwnerDashboard = async (ownerId) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: Number(ownerId) },
    include: {
      ratings: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!store) return null;

  const avgRating = computeAvgRating(store.ratings);
  return { ...store, avgRating, totalRatings: store.ratings.length };
};

module.exports = { getAllStores, getStoreById, createStore, updateStore, deleteStore, getOwnerDashboard };
