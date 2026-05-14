const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

const addressSchema = z.string().max(400, "Address must be at most 400 characters").optional();

const emailSchema = z.string().email("Invalid email address");

const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(["USER", "STORE_OWNER", "ADMIN"]).optional(),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: z.string().min(1, "Address is required").max(400, "Address too long"),
  ownerId: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const n = Number(val);
      return isNaN(n) ? null : n;
    })
    .optional()
    .nullable(),
});

const updateStoreSchema = createStoreSchema.partial();

const ratingSchema = z.object({
  value: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  storeId: z.number().int().positive("Invalid store ID"),
});

const createUserSchema = signupSchema.extend({
  role: z.enum(["USER", "STORE_OWNER", "ADMIN"]),
});

module.exports = {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
  createStoreSchema,
  updateStoreSchema,
  ratingSchema,
  createUserSchema,
};
