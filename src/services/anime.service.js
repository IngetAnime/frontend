import axios from "./axiosConfig.js";

export const updateAnime = async (
  animeId, picture, title, titleID, titleEN, releaseAt, episodeTotal, animeStatus
) => {
  let data, success, message, status;
  try {
    const response = await axios.put(`/api/v1/anime/${animeId}`, {
      picture, title, titleID, titleEN, releaseAt, episodeTotal, status: animeStatus
    });
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil memperbarui ${data.title}`
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

export const getAnimeTimeline = async (
  weekCount, timeZone, myListOnly, originalSchedule
) => {
  let data, success, message, status;
  try {
    const response = await axios.get(`/api/v1/anime/timeline`, {
      params: {
        weekCount, timeZone, myListOnly, originalSchedule
      }
    });
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil mendapatkan timeline ${timeZone}`
  } catch(err) {
    if (err.response?.status) {
      status = err.response.status;
      success = false;
      if (status === 400) 
        message = 'Kesalahan input'
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