import axios from "axios";
import { getUserDetails } from "./authService";
import { logoutUser } from "./authService";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";
console.log("API Base URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleRequestError = (error: any, defaultMessage: string) => {
  console.error(defaultMessage + ":", error);
  return { success: false, error: error.response?.data?.message || error.message };
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      logoutUser();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const user = getUserDetails();
    if (user && user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
