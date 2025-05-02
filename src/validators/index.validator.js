import { z } from "zod";

// Authentication
export const email = z.string().email().nonempty()
export const loginPassword = z
  .string()
  .min(8, "Minimal 8 karakter")
  .max(64, "Maksimal 64 karakter")
export const confirmPassword = z.string().min(8, "Password must be at least 8 characters long")
export const username = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must not exceed 20 characters")
  .regex(/^(?!_)(?!.*__)[a-zA-Z0-9_]+(?<!_)$/, 
    "Username can only contain letters, numbers, and underscores, but cannot start or end with an underscore"
  )
export const identifier = z
  .string()
  .min(3, 'Minimal 3 karakter')
  .refine(
    (value) =>
      /^[a-zA-Z0-9_]+$/.test(value) || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
    {
      message: "Username atau email tidak valid",
    }
  )
