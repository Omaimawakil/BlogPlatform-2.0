import axios from "axios";
import { getEditToken } from "./editTokens";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://blogplatform-2-0.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;

  const match = config.url?.match(/^\/posts\/([^/?]+)/);
  if (match) {
    const editToken = getEditToken(match[1]);
    if (editToken) config.headers["x-edit-token"] = editToken;
  }
  return config;
});

export default API;