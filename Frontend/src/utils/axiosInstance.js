import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers:{
        "Content-Type":"application/json",
    },
});
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        console.log("Axios Stored token:", accessToken);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            console.warn("No token found, request sent without authorization header");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance; 