import { z } from "zod";
import { date, link, num_watched_episodes, oneAnimeStatus, q } from "./index.validator";

export const updateAnimeSchema = z.object({
  picture: link,
  title: q,
  titleID: q.nullable(),
  titleEN: q.nullable(),
  releaseAt: date.nullable(),
  episodeTotal: num_watched_episodes,
  status: oneAnimeStatus,
})
