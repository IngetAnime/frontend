import { z } from "zod";
import { anime_type, booleanB, date, idB, num_watched_episodes, oneAccessType, ranking_type, score, season, sortAnime, status, year } from "./index.validator";

export const getAnimeRankingSchema = z.object({
  rankingType: ranking_type.optional(),
  accessType: oneAccessType.optional(),
  status: status.optional(),
  platform: z.string().optional() // Test only
})

export const getSeasonalAnimeSchema = z.object({
  sort: sortAnime.optional(),
  year,
  season,
  animeType: anime_type.optional(),
  accessType: oneAccessType.optional(),
  status: status.optional(),
  platform: z.string().optional()
})