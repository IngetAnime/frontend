import axios from "./axiosConfig.js";

export const login = async (identifier, password) => {
  const data = await axios.post('/api/v1/auth/login', { identifier, password });
  return data;
}

export const logout = async () => {
  const data = await axios.post('/api/v1/auth/logout');
  return data;
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
  const data = await axios.post('/api/v1/auth/register', { username, email, password, confirmPassword })
  return data;
}

export const resendVerification = async () => {
  const data = await axios.post('/api/v1/auth/resend-verification');
  return data;
}

export const verifyEmail = async (token) => {
  const data = await axios.post('/api/v1/auth/verify-email', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data;
}