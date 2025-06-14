import { z } from "zod";
import { anime_type, idB, q, ranking_type, searchAccessType, searchStatus, season, sortAnime, year } from "./index.validator";

export const getAnimeListSchema = z.object({
  q
})

export const getAnimeRankingSchema = z.object({
  rankingType: ranking_type,
  accessType: searchAccessType,
  status: searchStatus,
  platform: idB,
})

export const getSeasonalAnimeSchema = z.object({
  sort: sortAnime.optional(),
  year,
  season,
  animeType: anime_type.optional(),
  accessType: searchAccessType,
  status: searchStatus,
  platform: idB,
})