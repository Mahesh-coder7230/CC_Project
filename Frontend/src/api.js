import axios from "axios";

// Shared axios instance for the whole app.
// Keeps the base URL in one place and automatically attaches the
// logged-in user's JWT (if present) to every request.
const api = axios.create({
  baseURL: "http://51.20.7.171:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
