// src/services/authService.js
import api from "../api/api";

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const signup = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

// fetch users (returns [{ userId, name, email, role }])
export const getUsers = async () => {
  const res = await api.get("/auth");
  return res.data;
};
