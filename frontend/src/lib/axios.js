import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
});

let currentAccessToken = null;

export function setAccessToken(token) {
  currentAccessToken = token;
}

api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization =
      `Bearer ${currentAccessToken}`;
  }

  return config;
});

export default api;