import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character');

export const nameSchema = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters');

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: nameSchema,
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  address: z.string().max(400, 'Address too long').optional(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const storeSchema = z.object({
  name: nameSchema,
  email: z.string().email('Invalid email'),
  address: z.string().min(1, 'Address is required').max(400, 'Address too long'),
  ownerId: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return null;
      const n = Number(val);
      return isNaN(n) ? null : n;
    })
    .optional()
    .nullable(),
});

export const createUserSchema = z.object({
  name: nameSchema,
  email: z.string().email('Invalid email'),
  password: passwordSchema,
  address: z.string().max(400).optional(),
  role: z.enum(['USER', 'STORE_OWNER', 'ADMIN']),
});
