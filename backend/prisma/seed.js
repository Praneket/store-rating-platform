const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const salt = 10;

  // Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@storerating.com" },
    update: {},
    create: {
      name: "System Administrator User",
      email: "admin@storerating.com",
      password: await bcrypt.hash("Admin@1234", salt),
      address: "123 Admin Street, New York, NY 10001",
      role: "ADMIN",
    },
  });

  // Seed Normal Users
  const user1 = await prisma.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      name: "John Alexander Doe Smith",
      email: "john.doe@example.com",
      password: await bcrypt.hash("User@1234", salt),
      address: "456 Main Street, Los Angeles, CA 90001",
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      name: "Jane Elizabeth Smith Johnson",
      email: "jane.smith@example.com",
      password: await bcrypt.hash("User@1234", salt),
      address: "789 Oak Avenue, Chicago, IL 60601",
      role: "USER",
    },
  });

  // Seed Store Owners
  const owner1 = await prisma.user.upsert({
    where: { email: "owner.coffee@example.com" },
    update: {},
    create: {
      name: "Michael Robert Johnson Williams",
      email: "owner.coffee@example.com",
      password: await bcrypt.hash("Owner@1234", salt),
      address: "321 Coffee Lane, Seattle, WA 98101",
      role: "STORE_OWNER",
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "owner.books@example.com" },
    update: {},
    create: {
      name: "Sarah Louise Williams Brown",
      email: "owner.books@example.com",
      password: await bcrypt.hash("Owner@1234", salt),
      address: "654 Book Street, Boston, MA 02101",
      role: "STORE_OWNER",
    },
  });

  // Seed Stores
  const store1 = await prisma.store.upsert({
    where: { email: "coffeehouse@example.com" },
    update: {},
    create: {
      name: "The Grand Coffee House Store",
      email: "coffeehouse@example.com",
      address: "321 Coffee Lane, Seattle, WA 98101",
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: "bookshop@example.com" },
    update: {},
    create: {
      name: "Classic Books and Literature Shop",
      email: "bookshop@example.com",
      address: "654 Book Street, Boston, MA 02101",
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.upsert({
    where: { email: "techstore@example.com" },
    update: {},
    create: {
      name: "Future Tech Electronics Mega Store",
      email: "techstore@example.com",
      address: "987 Tech Blvd, San Francisco, CA 94102",
    },
  });

  // Seed Ratings
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store1.id } },
    update: {},
    create: { value: 5, userId: user1.id, storeId: store1.id },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store1.id } },
    update: {},
    create: { value: 4, userId: user2.id, storeId: store1.id },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store2.id } },
    update: {},
    create: { value: 3, userId: user1.id, storeId: store2.id },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store3.id } },
    update: {},
    create: { value: 4, userId: user2.id, storeId: store3.id },
  });

  console.log("✅ Seed completed successfully");
  console.log("Admin:", admin.email, "| Password: Admin@1234");
  console.log("User:", user1.email, "| Password: User@1234");
  console.log("Owner:", owner1.email, "| Password: Owner@1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
