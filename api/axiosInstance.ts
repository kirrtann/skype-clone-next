// src/api/axiosInstance.ts
import { BASE_URL } from "@/constant";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      (() => {
        try {
          const userData = localStorage.getItem("user-storage");
          if (userData) {
            const parsed = JSON.parse(userData);
            return parsed?.state?.user?.token;
          }
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
        return null;
      })();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.message || error.message);
    if (error.response?.status === 401) {
      console.warn("Authentication failed - clearing storage");
      localStorage.removeItem("token");
      localStorage.removeItem("user-storage");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
