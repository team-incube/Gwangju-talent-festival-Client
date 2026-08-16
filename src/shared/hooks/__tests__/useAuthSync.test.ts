import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthSync } from "../useAuthSync";
import { setTokens, clearTokens } from "@/shared/utils/auth";

const FUTURE = new Date(Date.now() + 3_600_000).toISOString();

function clearAllCookies() {
  document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

describe("useAuthSync", () => {
  beforeEach(clearAllCookies);

  it("토큰 쿠키가 없으면 로그아웃 상태로 시작한다", () => {
    const { result } = renderHook(() => useAuthSync());
    expect(result.current.isUserLoggedIn).toBe(false);
  });

  it("setTokens 호출 시 같은 탭에서 즉시 로그인 상태로 갱신된다", () => {
    const { result } = renderHook(() => useAuthSync());
    expect(result.current.isUserLoggedIn).toBe(false);

    act(() => {
      setTokens("access-abc", FUTURE, "refresh-xyz", FUTURE);
    });

    expect(result.current.isUserLoggedIn).toBe(true);
  });

  it("clearTokens 호출 시 같은 탭에서 즉시 로그아웃 상태로 갱신된다", () => {
    setTokens("access-abc", FUTURE, "refresh-xyz", FUTURE);
    const { result } = renderHook(() => useAuthSync());
    expect(result.current.isUserLoggedIn).toBe(true);

    act(() => {
      clearTokens();
    });

    expect(result.current.isUserLoggedIn).toBe(false);
  });
});
