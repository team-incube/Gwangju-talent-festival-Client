import { describe, it, expect, beforeEach, vi } from "vitest";
import { setTokens, clearTokens, getTokenFromCookie, isLoggedIn, AUTH_CHANGE_EVENT } from "../auth";

const FUTURE = new Date(Date.now() + 3_600_000).toISOString();

function clearAllCookies() {
  document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

describe("setTokens", () => {
  beforeEach(clearAllCookies);

  it("accessToken과 refreshToken을 쿠키에 저장한다", () => {
    setTokens("access-abc", FUTURE, "refresh-xyz", FUTURE);
    expect(getTokenFromCookie("accessToken")).toBe("access-abc");
    expect(getTokenFromCookie("refreshToken")).toBe("refresh-xyz");
  });

  it("authchange 이벤트를 발생시켜 같은 탭의 로그인 상태를 갱신할 수 있게 한다", () => {
    const listener = vi.fn();
    window.addEventListener(AUTH_CHANGE_EVENT, listener);

    setTokens("access-abc", FUTURE, "refresh-xyz", FUTURE);

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(AUTH_CHANGE_EVENT, listener);
  });
});

describe("clearTokens", () => {
  beforeEach(clearAllCookies);

  it("accessToken과 refreshToken 쿠키를 삭제한다", () => {
    setTokens("access-abc", FUTURE, "refresh-xyz", FUTURE);
    clearTokens();
    expect(getTokenFromCookie("accessToken")).toBeNull();
    expect(getTokenFromCookie("refreshToken")).toBeNull();
  });

  it("authchange 이벤트를 발생시켜 같은 탭의 로그인 상태를 갱신할 수 있게 한다", () => {
    setTokens("access-abc", FUTURE, "refresh-xyz", FUTURE);

    const listener = vi.fn();
    window.addEventListener(AUTH_CHANGE_EVENT, listener);

    clearTokens();

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(AUTH_CHANGE_EVENT, listener);
  });
});

describe("getTokenFromCookie", () => {
  beforeEach(clearAllCookies);

  it("쿠키에 저장된 값을 반환한다", () => {
    document.cookie = "myToken=hello123; path=/;";
    expect(getTokenFromCookie("myToken")).toBe("hello123");
  });

  it("존재하지 않는 쿠키면 null을 반환한다", () => {
    expect(getTokenFromCookie("nonExistent")).toBeNull();
  });
});

describe("isLoggedIn", () => {
  beforeEach(clearAllCookies);

  it("accessToken과 refreshToken이 모두 있으면 true를 반환한다", () => {
    setTokens("access-abc", FUTURE, "refresh-xyz", FUTURE);
    expect(isLoggedIn()).toBe(true);
  });

  it("토큰이 하나도 없으면 false를 반환한다", () => {
    expect(isLoggedIn()).toBe(false);
  });

  it("accessToken만 있으면 false를 반환한다", () => {
    document.cookie = "accessToken=access-abc; path=/;";
    expect(isLoggedIn()).toBe(false);
  });

  it("refreshToken만 있으면 false를 반환한다", () => {
    document.cookie = "refreshToken=refresh-xyz; path=/;";
    expect(isLoggedIn()).toBe(false);
  });
});
