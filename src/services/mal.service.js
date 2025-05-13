import axios from "./axiosConfig.js";

const initialFields = 'synopsis,mean,genres,start_date,average_episode_duration,num_list_users,media_type,start_season'

export const getAnimeRanking = async (ranking_type, limit=100, offset, fields) => {
  fields = `${initialFields}${fields ? fields : ''}`
  let data, success, message, status;
  try {
    const response = await axios.get('/api/v1/anime/ranking', {
      params: {
        ranking_type, limit, offset, fields
      }
    });
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil mendapatkan list anime ${ranking_type}`;
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

export const getSeasonalAnime = async (year, season, sort, limit=100, offset, fields='') => {
  fields = `${initialFields}${fields ? fields : ''}`
  let data, success, message, status;
  try {
    const response = await axios.get(`/api/v1/anime/season/${year}/${season}`, {
      params: {
        sort, limit, offset, fields
      }
    });
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil mendapatkan list anime ${season} ${year}`;
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

export const getSuggestedAnime = async (limit=100, offset, fields) => {
  fields = `${initialFields}${fields ? fields : ''}`
  let data, success, message, status;
  try {
    const response = await axios.get(`/api/v1/anime/suggestions`, {
      params: { limit, offset, fields }
    });
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil mendapatkan rekomendasi anime`
  } catch(err) {
    if (err.response?.status) {
      status = err.response.status;
      success = false;
      if (status === 400) 
        message = 'Kesalahan input'
      else if (status === 403 && err.response.data.message?.includes('MyAnimeList')) 
        message = 'Akun belum terhubung dengan MyAnimeList. Silakan hubungkan terlebih dahulu di pengaturan profil'
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

export const getMyAnimeListStatus = async (malId) => {
  let data, success, message, status;
  const { success: isConnectToMAL, message: malMessage } = await getSuggestedAnime(1)
  if (!isConnectToMAL) {
    success = false; 
    message= malMessage
  } else {
    try {
      const response = await axios.get(`/api/v1/anime/mal/${malId}`, {
        params: { fields: 'my_list_status' }
      });
      data = response.data;
      status = response.status;
      if (response.data.my_list_status) {
        message = `Berhasil mendapatkan status ${data.title} dari MyAnimeList`;
        success = true;
      } else {
        message = `Status ${data.title} tidak ditemukan di MyAnimeList`;
        success = false;
      }
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
  }

  return { success, data, status, message };
}

export const getAnimeDetail = async (malId) => {
  let data, success, message, status;
  try {
    const response = await axios.get(`/api/v1/anime/mal/${malId}`);
    data = response.data;
    status = response.status;
    message = `Berhasil mendapatkan detail ${data.title} dari MyAnimeList`;
    success = true;
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