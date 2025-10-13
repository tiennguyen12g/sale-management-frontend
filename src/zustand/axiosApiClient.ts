import axios from "axios";
import { useAuthStore } from "../zustand/authStore";

const axiosApiCall = axios.create({ timeout: 15000 });

// ✅ Interceptor works for any URL, no need for baseURL
axiosApiCall.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosApiCall;
