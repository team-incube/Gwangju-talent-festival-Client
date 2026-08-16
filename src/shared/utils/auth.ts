"use client";

import { clearCookie, setCookie } from "./cookie";

export const AUTH_CHANGE_EVENT = "authchange";

// 쿠키 변경은 focus/visibilitychange 이벤트를 유발하지 않으므로,
// 같은 탭에서 클라이언트 라우팅만으로 로그인 상태를 갱신하려면 별도 이벤트가 필요하다
const notifyAuthChange = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const setTokens = (
  accessToken: string,
  accessTokenExpiredAt: string,
  refreshToken: string,
  refreshTokenExpiredAt: string,
) => {
  setCookie("accessToken", accessToken, new Date(accessTokenExpiredAt));
  setCookie("refreshToken", refreshToken, new Date(refreshTokenExpiredAt));
  notifyAuthChange();
};

export const clearTokens = () => {
  clearCookie("accessToken");
  clearCookie("refreshToken");
  notifyAuthChange();
};

// 만료를 주지 않으면 세션 쿠키가 되어 브라우저를 닫으면 사라진다.
// 토큰은 남고 role만 사라지면 권한 판정이 깨지므로 토큰과 수명을 맞춘다
export const setRole = (role: string, expiresAt?: string) => {
  setCookie("role", role, expiresAt ? new Date(expiresAt) : undefined);
};

export const clearRole = () => {
  clearCookie("role");
};

export const getTokenFromCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const isLoggedIn = (): boolean => {
  const accessToken = getTokenFromCookie("accessToken");
  const refreshToken = getTokenFromCookie("refreshToken");
  return !!(accessToken && refreshToken);
};
