import { z } from "zod";

// Authentication
export const email = z.string().email('Email tidak valid').nonempty('Tidak boleh kosong')
export const loginPassword = z
  .string()
  .min(8, "Minimal 8 karakter")
  .max(64, "Maksimal 64 karakter")
export const password = loginPassword
  .regex(/[A-Z]/, "Minimal satu huruf besar [A-Z]")
  .regex(/[a-z]/, "Minimal satu huruf kecil [a-z]")
  .regex(/[0-9]/, "Minimal satu angka [0-9]")
  .regex(/[@$!%*?&]/, "Minimal satu karakter spesial [@$!%*?&]")
export const confirmPassword = z.string().min(8, "Minimal 8 karakter")
export const username = z
  .string()
  .min(3, "Minimal 3 karakter")
  .max(20, "Maksimal 20 karakter")
  .regex(/^(?!_)(?!.*__)[a-zA-Z0-9_]+(?<!_)$/, 
    "Username hanya terdiri dari huruf, angka, dan garis bawah, tetapi tidak dapat dimulai atau diakhiri dengan garis bawah"
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
