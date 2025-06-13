import { z } from "zod";
import { booleanB, email, importType, username } from "./index.validator";

export const updateUserProfileSchema = z.object({
  email, username
})

export const importMyAnimeListSchema = z.object({
  type: importType,
  isSyncedWithMal: booleanB.optional()
})