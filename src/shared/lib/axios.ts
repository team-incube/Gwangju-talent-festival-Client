import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getTokenFromCookie, setTokens, clearTokens } from "@/shared/utils/auth";
import { refresh } from "@/shared/api/refresh";
import { publicPages } from "@/shared/config/authConfig";

export const baseURL = "/api/server";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;

type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const isAuthPage = ["/signin", "/signup"].includes(window.location.pathname);
      config.withCredentials = !isAuthPage;

      const accessToken = getTokenFromCookie("accessToken");
      if (accessToken) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const requestUrl = originalRequest.url ?? "";

    // 심사 페이지는 비로그인 상태에서도 화면에 머물러야 해서(스켈레톤 표시),
    // 이 엔드포인트들의 401/403은 자동 리다이렉트/토큰 갱신 없이 그대로 호출부로 전달한다.
    if ((status === 401 || status === 403) && requestUrl.startsWith("/judge")) {
      return Promise.reject(error);
    }

    if (status === 403 || status === 401) {
      clearTokens();
      const currentPath = window.location.pathname;
      const search = window.location.search;

      if (currentPath !== "/signin") {
        const shouldSaveNext = !publicPages.some((p: string) => currentPath.startsWith(p));
        const nextParam = shouldSaveNext ? `?next=${encodeURIComponent(currentPath + search)}` : "";
        window.location.href = `/signin${nextParam}`;
      }

      return Promise.reject(error);
    }

    if (status !== 401 && status !== 403) return Promise.reject(error);

    const url = originalRequest.url ?? "";
    if (publicPages.some(p => url.includes(p))) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = originalRequest.headers ?? {};
            (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest) as Promise<AxiosResponse>);
          },
          reject: reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const {
        access_token: accessToken,
        access_token_expired_at: accessTokenExpiredAt,
        refresh_token: refreshToken,
        refresh_token_expired_at: refreshTokenExpiredAt,
      } = await refresh(getTokenFromCookie("refreshToken") ?? "");

      setTokens(accessToken, accessTokenExpiredAt, refreshToken, refreshTokenExpiredAt);

      processQueue(null, accessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;

      return instance(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);

      clearTokens();

      const currentPath = window.location.pathname;
      const search = window.location.search;

      if (!publicPages.some((p: string) => currentPath.startsWith(p))) {
        const nextParam = `?next=${encodeURIComponent(currentPath + search)}`;
        window.location.href = `/signin${nextParam}`;
      } else {
        window.location.href = "/signin";
      }

      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

export default instance;
