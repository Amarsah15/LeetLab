import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://leetlab-azp5.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
