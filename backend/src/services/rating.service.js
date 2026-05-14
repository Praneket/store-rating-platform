const prisma = require("../config/database");

const submitOrUpdateRating = async (userId, { storeId, value }) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    const err = new Error("Store not found");
    err.statusCode = 404;
    throw err;
  }

  const rating = await prisma.rating.upsert({
    where: { userId_storeId: { userId, storeId } },
    update: { value },
    create: { userId, storeId, value },
    include: { store: { select: { id: true, name: true } } },
  });

  return rating;
};

const getUserRatings = async (userId) => {
  return prisma.rating.findMany({
    where: { userId },
    include: { store: { select: { id: true, name: true, address: true } } },
    orderBy: { updatedAt: "desc" },
  });
};

module.exports = { submitOrUpdateRating, getUserRatings };
