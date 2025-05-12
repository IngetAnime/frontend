import { z } from "zod";
import { anime_type, booleanB, date, idB, num_watched_episodes, oneAccessType, ranking_type, score, searchAccessType, searchStatus, season, sortAnime, status, year } from "./index.validator";

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