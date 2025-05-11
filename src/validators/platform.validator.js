import { z } from "zod";
import { booleanB, dateTime, idB, link, num_watched_episodes, oneAccessType } from "./index.validator";

export const updateAnimePlatformSchema = z.object({
  platformId: idB,
  link: link, 
  accessType: oneAccessType, 
  nextEpisodeAiringAt: dateTime, 
  lastEpisodeAiredAt: dateTime.nullable(), 
  intervalInDays: idB, 
  episodeAired: num_watched_episodes, 
  isMainPlatform: booleanB,
  isHiatus: booleanB,
})

export const deleteAnimePlatformSchema = z.object({
  animeId: idB,
  platformId: idB
})