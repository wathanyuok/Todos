// client/src/services/api.js
import axios from "axios";
import { useUser } from "../store/user-store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5600",
  withCredentials: true,
});

const bootToken = localStorage.getItem("accessToken");
if (bootToken) api.defaults.headers.Authorization = `Bearer ${bootToken}`;

api.interceptors.request.use((config) => {
  const { token } = useUser.getState();
  const fallback = localStorage.getItem("accessToken");
  const useToken = token || fallback;
  if (useToken) config.headers.Authorization = `Bearer ${useToken}`;
  return config;
});

export default api;
