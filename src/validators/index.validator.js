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

// Explore
export const link = z.string({ message: 'Tautan tidak valid' }).url('Tautan tidak valid')
export const q = z
  .string().min(3, 'Minimal 3 karakter')
export const dateTime = z
  .string({ message: 'Wajib diisi' })
  .refine(
    (value) => !isNaN(Date.parse(value)),
    "Invalid datetime. Value must be ISO String format"
  )
export const ranking_type = z
  .enum(["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"], {
    errorMap: () => ({ 
      message: "ranking_type must be one of: all, airing, upcoming, tv, ova, movie, special, bypopularity, or favorite"
    })
  })
export const anime_type = z
  .enum(["all", "new", "continue", "tv", "ona", "ova", "movie", "special"], {
    errorMap: () => ({ 
      message: "ranking_type must be one of: all, new, continue, tv, ona, ova, movie, or special"
    })
  })
export const oneAccessType = z
  .enum(["limited_time", "subscription", "free"], {
    errorMap: () => ({ message: "Wajib memilih salah satu" })
  })
export const num_watched_episodes = z.number({ message: 'Harus berupa angka' }).int('Harus berupa bilangan bulat').nonnegative('Tidak boleh negatif')
export const oneAnimeStatus = z
  .enum(["currently_airing", "finished_airing", "not_yet_aired"], {
    errorMap: () => ({ message: "status must be one of: currently_airing, finished_airing, or not_yet_aired" })
  })
export const status = z
  .enum(["watching", "completed", "plan_to_watch", "on_hold", "dropped"], {
    errorMap: () => ({ 
      message: "status must be one of: watching, completed, plan_to_watch, on_hold, or dropped"
    }),
  })
export const onePlatform = z
  .enum()
export const sortAnime = z.enum(["mean", "num_list_users", "start_date"], {
    errorMap: () => ({ 
      message: "sort must be one of: mean num_list_users, or start_date"
    })
  })
export const idB = z.number({ message: 'Wajib dipilih' }).int().nonnegative()
export const booleanB = z.boolean()
export const score = z.number().int().min(0).max(10)
export const date = z
  .string({ message: 'Wajib diisi' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid format. Valid format: YYYY-MM-DD")
  .refine(
    (value) => !isNaN(Date.parse(value)),
    "Invalid date"
  )
export const year = z
  .string()
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val) && val >= 1917, {
    message: 'Year start from 1917'
  })
export const season = z
  .enum(["winter", "spring", "summer", "fall"], {
    errorMap: () => ({ 
      message: "season must be one of: winter, spring, summer, or fall"
    })
  })
export const searchAccessType = z
  .enum(["all", "available_for_free", "limited_time", "subscription_only"], {
    errorMap: () => ({ 
      message: "accessType must be one of: all, available_for_free, limited_time, or subscription_only"
    })
  })
export const searchStatus = z
  .enum(["all", "none", "watching", "completed", "plan_to_watch", "on_hold", "dropped"], {
    errorMap: () => ({ 
      message: "status must be one of: all, none, watching, completed, plan_to_watch, on_hold, or dropped"
    }),
  })