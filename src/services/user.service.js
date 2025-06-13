import axios from "./axiosConfig.js";

export const getUserInformation = async () => {
  let data, success, message, status;
  try {
    const response = await axios.get(`/api/v1/user/@me`);
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil mendapatkan informasi user`;
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

export const importAnimeList = async (type, isSyncedWithMal) => {
  let data, success, message, status;
  try {
    const response = await axios.post(`/api/v1/user/@me/import-list-mal`, { type, isSyncedWithMal });
    data = response.data;
    status = response.status;
    success = true;
    message = `Berhasil memperbarui ${data.count} list anime`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Invalid request'
    } else if (err.response) {
      status = err.response.status;
      success = false;
      message = err.response.message;
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const checkEmailAvailability = async (email) => {
  let data, success, message, status;
  try {
    const response = await axios.get(`/api/v1/user/check/email`, { params: { email } });
    data = response.data;
    status = response.status;
    success = true;
    message = `${email} tersedia`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Invalid request'
    } else if (err.response && err.response.status === 409) {
      status = err.response.status;
      success = false;
      message = `${email} sudah digunakan`;
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const checkUsernameAvailability = async (username) => {
  let data, success, message, status;
  try {
    const response = await axios.get(`/api/v1/user/check/username`, { params: { username } });
    data = response.data;
    status = response.status;
    success = true;
    message = `${username} tersedia`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Invalid request'
    } else if (err.response && err.response.status === 409) {
      status = err.response.status;
      success = false;
      message = `${username} sudah digunakan`;
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const updateUserProfile = async (username, email) => {
  let data, success, message, status;
  try {
    const response = await axios.post(`/api/v1/user/@me`, { username, email });
    data = response.data;
    status = response.status;
    success = true;
    message = `Profil berhasil diperbarui`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Invalid request'
    } else if (err.response && err.response.status === 409) {
      status = err.response.status;
      success = false;
      if (err.response.message.includes('email'))
        message = `Email sudah digunakan`;
      else 
        message = `Username sudah digunakan`;
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}