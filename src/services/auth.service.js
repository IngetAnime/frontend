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