import axios, { InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

if (typeof window !== "undefined") {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const isAuthPage = ["/signin", "/signup"].includes(
      window.location.pathname
    );

    config.withCredentials = !isAuthPage;

    return config;
  });
}

export default instance;
