import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Create an Axios instance with the base URL specified by VITE_API_URL.
// This allows us to make API requests with simpler URLs like api.get("/data"),
// which is equivalent to axios.get(`${baseURL}/data`).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add the access token to the request headers if it exists in localStorage.
// If the access token is present, it will be included as a Bearer token in the Authorization header.
// If the access token is not present, no Authorization header will be added.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
