import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";
console.log("API Base URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
