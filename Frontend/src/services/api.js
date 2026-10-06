import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // console.log("TOKEN FROM LOCAL STORAGE:", token)

    if (token) {
      // config.headers = config.headers || {}; //tem
      config.headers.Authorization = `Bearer ${token}`;
    }
    //tem
    // console.log("REQUEST URL:", config.baseURL + config.url);
    // console.log("REQUEST HEADERS:", config.headers);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
