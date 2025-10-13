import axios from "./axiosConfig.js";

export const getAnimeList = async (q, limit=25, page=1) => {
  let data, success, message, status;
  try {
    const response = await axios.get('/api/v1/jikan', {
      params: {
        q, limit, page
      }
    });
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil mendapatkan list anime ${q}`;
  } catch(err) {
    if (err.response && err.response.status === 404) {
      status = err.response.status;
      success = false;
      message = err.response.data.message;
    } if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Input tidak valid';
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan';
    }  
  }

  return { success, data, status, message };
}
