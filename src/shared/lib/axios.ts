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
    // 조회(GET) 요청의 401/403은 자동 리다이렉트/토큰 갱신 없이 그대로 호출부로 전달한다.
    // 저장(PUT 등) 요청까지 여기 걸리면 토큰 만료 시 재발급 없이 저장이 실패하므로 GET만 예외 처리한다.
    const requestMethod = originalRequest.method?.toLowerCase();
    if ((status === 401 || status === 403) && requestMethod === "get" && requestUrl.startsWith("/judge")) {
      return Promise.reject(error);
    }

    // 403(권한 없음)은 토큰 재발급으로 해결되지 않으므로 그대로 호출부에 전달
    if (status !== 401) return Promise.reject(error);

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
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
      } = await refresh(getTokenFromCookie("refreshToken") ?? "");

      setTokens(accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt);

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
