import axios from "./axiosConfig.js";

export const updateAnimeList = async (
  animeId, animePlatformId, startDate, finishDate, progress, score, episodesDifference, animeStatus, isSyncedWithMal
) => {
  let data, success, message, status;
  try {
    const response = await axios.patch(`/api/v1/anime/${animeId}/my-list-status`, {
      animePlatformId, progress, score, episodesDifference, 
      status: animeStatus, isSyncedWithMal, startDate, finishDate, 
    });
    data = response.data;
    status = response.status;
    success = true;
    if (status === 201) message = `Berhasil menambahkan ${data.anime.title}`
    else if (status === 200) message = `Berhasil memperbarui ${data.anime.title}`
  } catch(err) {
    if (err.response?.status) {
      status = err.response.status;
      success = false;
      if (status === 400) 
        message = 'Kesalahan input'
      else if (status === 403 && err.response.data.message?.includes('MyAnimeList')) 
        message = 'Akun tidak terhubung dengan MyAnimeList. Silakan non aktifkan sinkronisasi dengan MyAnimeList'
      else if (status === 401 || status === 403)
        message = 'Silakan login terlebih dahulu'
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

export const deleteAnimeList = async (animeId) => {
  let data, success, message, status;
  try {
    const response = await axios.delete(`/api/v1/anime/${animeId}/my-list-status`);
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil menghapus ${data.anime.title}`
  } catch(err) {
    if (err.response?.status) {
      status = err.response.status;
      success = false;
      if (status === 404) 
        message = 'List anime tidak ditemukan'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}