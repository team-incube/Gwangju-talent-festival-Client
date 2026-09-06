import { describe, it, expect } from "vitest";
import { AxiosError } from "axios";
import { isOfflineError } from "../isOfflineError";

describe("isOfflineError", () => {
  it("서버 응답 없이 실패한 axios 에러는 오프라인으로 판단한다", () => {
    const error = new AxiosError("Network Error");
    expect(isOfflineError(error)).toBe(true);
  });

  it("서버가 응답을 내려준 axios 에러(예: 403)는 오프라인이 아니다", () => {
    const error = new AxiosError("Request failed with status code 403");
    error.response = {
      data: {},
      status: 403,
      statusText: "Forbidden",
      headers: {},
      config: error.config as never,
    };
    expect(isOfflineError(error)).toBe(false);
  });

  it("axios 에러가 아닌 값은 오프라인이 아니다", () => {
    expect(isOfflineError(new Error("일반 에러"))).toBe(false);
    expect(isOfflineError("문자열 에러")).toBe(false);
  });
});
