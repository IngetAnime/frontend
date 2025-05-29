import axios from "./axiosConfig.js";

export const login = async (identifier, password) => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/login', { identifier, password });
    data = response.data;
    status = response.status;
    success = true;
    message = 'Login berhasil';
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

export const logout = async () => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/logout');
    data = response.data;
    status = response.status;
    success = true;
    message = 'Logout berhasil';
  } catch(err) {
    status = err.status;
    success = false;
    message = 'Terjadi kesalahan'
  }

  return { success, data, status, message };
}

export const isAuthenticated = async () => {
  const data = await axios.get('/api/v1/auth/me');
  return data;
}

export const isAdmin = async () => {
  const data = await axios.get('/api/v1/auth/is-admin');
  return data;
}

export const register = async (username, email, password, confirmPassword) => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/register', { username, email, password, confirmPassword })
    data = response.data;
    status = response.status;
    success = true;
    message = `Tautan verifikasi telah dikirim ke email Anda`;
  } catch(err) {
    if (err.response && err.response.status === 409) {
      status = err.response.status;
      success = false;
      message = 'Username atau email telah digunakan'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const resendVerification = async () => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/resend-verification');
    data = response.data;
    status = response.status;
    success = true;
    message = `Tautan verifikasi telah dikirim ulang ke email Anda`;
  } catch(err) {
    if (err.response && err.response.status === 404) {
      status = err.response.status;
      success = false;
      message = 'Akun tidak valid, silakan login ulang'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const verifyEmail = async (token) => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/verify-email', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    data = response.data;
    status = response.status;
    success = true;
    message = `Email berhasil di verifikasi`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Token tidak valid atau sudah kedaluwarsa'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const forgotPassword = async (identifier) => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/forgot-password', { identifier })
    data = response.data;
    status = response.status;
    success = true;
    message = `Tautan reset password telah dikirim ke email Anda`;
  } catch(err) {
    if (err.response && err.response.status === 404) {
      status = err.response.status;
      success = false;
      message = 'Username atau email tidak ditemukan'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const resetPassword = async (token, newPassword, confirmPassword) => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/reset-password', { newPassword, confirmPassword }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    data = response.data;
    status = response.status;
    success = true;
    message = `Password berhasil diperbarui`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Token tidak valid atau sudah kedaluwarsa'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const loginWithGoogle = async (code, state) => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/google', { code, state })
    data = response.data;
    status = response.status;
    success = true;
    message = data.googleEmail ? 'Berhasil terhubung dengan Google' : `Login dengan Google berhasil`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Code tidak valid atau sudah kedaluwarsa'
    } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      status = err.response.status;
      success = false;
      message = 'Silakan login terlebih dahulu'
    } else if (err.response && err.response.status === 409) {
      status = err.response.status;
      success = false;
      message = 'Akun Google ini sudah terhubung dengan pengguna lain'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const loginWithMal = async (code, state) => {
  let data, success, message, status;
  try {
    const response = await axios.post('/api/v1/auth/mal', { code, state })
    data = response.data;
    status = response.status;
    success = true;
    message = data.myAnimeList ? 'Berhasil terhubung dengan MyAnimeList' : `Login dengan MyAnimeList berhasil`;
  } catch(err) {
    if (err.response && err.response.status === 400) {
      status = err.response.status;
      success = false;
      message = 'Code tidak valid atau sudah kedaluwarsa'
    } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      status = err.response.status;
      success = false;
      message = 'Silakan login terlebih dahulu'
    } else if (err.response && err.response.status === 409) {
      status = err.response.status;
      success = false;
      message = 'Akun MyAnimeList ini sudah terhubung dengan pengguna lain'
    } else {
      status = err.status;
      success = false;
      message = 'Terjadi kesalahan'
    }
  }

  return { success, data, status, message };
}

export const getGoogleAuthUrl = async (mode='login') => {
  const data = await axios.get('/api/v1/auth/google', { params: { mode } })
  return data;
}

export const getMALAuthUrl = async (mode='login') => {
  const data = await axios.get('/api/v1/auth/mal', { params: { mode } })
  return data;
}