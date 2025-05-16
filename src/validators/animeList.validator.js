import { z } from "zod";
import { booleanB, date, idB, num_watched_episodes, score, searchAccessType, searchStatus, sortAllList, sortList, status } from "./index.validator";

export const updateAnimeListSchema = z.object({
  animePlatformId: idB.nullable(), 
  startDate: date.nullable(), 
  finishDate: date.nullable(), 
  progress: num_watched_episodes, 
  score: score, 
  episodesDifference: num_watched_episodes, 
  status: status, 
  isSyncedWithMal: booleanB
})

export const deleteAnimeListSchema = z.object({
  isSyncedWithMal: booleanB
})

export const getAllAnimeListSchema = z.object({
  sort: sortAllList,
  accessType: searchAccessType,
  platform: idB,
})