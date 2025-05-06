import axios from "./axiosConfig.js";

export const login = async (ranking_type, limit=100, offset, fields) => {
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
    message = `Berhasil mendapatkan ${ranking_type}`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Username, email, atau password yang dimasukkan salah'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}