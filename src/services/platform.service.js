import axios from "./axiosConfig.js";

export const getPlatforms = async () => {
  let data, success, message, status;
  try {
    const response = await axios.get(`/api/v1/anime/platform`);
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil mendapatkan daftar platform`;
  } catch(err) {
    if (err.response && err.response.status === 404) {
      status = err.response.status;
      success = false;
      message = err.response.data.message
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const updateAnimePlatform = async (
  animeId, platformId, link, accessType, nextEpisodeAiringAt, 
  lastEpisodeAiredAt, intervalInDays, episodeAired, isMainPlatform
) => {
  let data, success, message, status;
  try {
    const response = await axios.patch(`/api/v1/anime/${animeId}/platform/${platformId}`, {
      link, accessType, nextEpisodeAiringAt, lastEpisodeAiredAt, intervalInDays, episodeAired, isMainPlatform
    });
    data = response.data;
    status = response.status;
    success = true;
    if (status === 201) message = `Berhasil menambahkan platform ${data.platform.name} untuk anime ${data.anime.title}`
    else if (status === 200) message = `Berhasil memperbarui platform ${data.platform.name} untuk anime ${data.anime.title}`
  } catch(err) {
    if (err.response?.status) {
      status = err.response.status;
      success = false;
      if (status === 400) 
        message = 'Kesalahan input'
      else if (status === 401 || status === 403)
        message = 'Hanya boleh dilakukan oleh Admin'
      else 
        message = err.response.data.message
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}