import axios from "axios";
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("customer_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token invalid or expired — logging out");
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_name");
      localStorage.removeItem("customer_number");
      // window.location.reload();
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);
