import axios from "axios";

const api = axios.create({
  baseURL: typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8080/api"
    : "https://zestful-creativity-production-7065.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default api;