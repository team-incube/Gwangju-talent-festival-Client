import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleSigninFormSubmit } from "../handleSigninFormSubmit";

vi.mock("@/entities/user/api/signin", () => ({ signin: vi.fn() }));
vi.mock("@/shared/utils/auth", () => ({ setTokens: vi.fn(), setRole: vi.fn() }));

import { signin } from "@/entities/user/api/signin";
import { setTokens, setRole } from "@/shared/utils/auth";

const mockSignin = vi.mocked(signin);
const mockSetTokens = vi.mocked(setTokens);
const mockSetRole = vi.mocked(setRole);

const MOCK_RESPONSE = {
  accessToken: "access-abc",
  accessTokenExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  refreshToken: "refresh-xyz",
  refreshTokenExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  role: "USER" as const,
};

const INITIAL_STATE = { values: {}, isValid: false, submitted: false };

function makeFormData(data: Record<string, string>) {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.append(k, v));
  return fd;
}

function setLocationSearch(search: string) {
  Object.defineProperty(window, "location", {
    value: { search },
    writable: true,
    configurable: true,
  });
}

function clearAllCookies() {
  document.cookie.split(";").forEach(c => {
    const name = c.split("=")[0].trim();
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  setLocationSearch("");
  clearAllCookies();
});

describe("handleSigninFormSubmit - 유효성 검사", () => {
  it("전화번호 형식이 잘못되면 API를 호출하지 않고 isValid: false를 반환한다", async () => {
    const result = await handleSigninFormSubmit(
      INITIAL_STATE,
      makeFormData({ phoneNumber: "010-1234-5678", password: "pass1234" }),
    );
    expect(result.isValid).toBe(false);
    expect(result.submitted).toBe(true);
    expect(mockSignin).not.toHaveBeenCalled();
  });

  it("비밀번호가 짧으면 API를 호출하지 않고 isValid: false를 반환한다", async () => {
    const result = await handleSigninFormSubmit(
      INITIAL_STATE,
      makeFormData({ phoneNumber: "01012345678", password: "ab1" }),
    );
    expect(result.isValid).toBe(false);
    expect(mockSignin).not.toHaveBeenCalled();
  });
});

describe("handleSigninFormSubmit - 로그인 성공", () => {
  it("setTokens를 올바른 인자로 호출하고 role 쿠키를 저장한다", async () => {
    mockSignin.mockResolvedValue(MOCK_RESPONSE);
    await handleSigninFormSubmit(
      INITIAL_STATE,
      makeFormData({ phoneNumber: "01012345678", password: "pass1234" }),
    );
    expect(mockSetTokens).toHaveBeenCalledWith(
      MOCK_RESPONSE.accessToken,
      MOCK_RESPONSE.accessTokenExpiresAt,
      MOCK_RESPONSE.refreshToken,
      MOCK_RESPONSE.refreshTokenExpiresAt,
    );
    expect(mockSetRole).toHaveBeenCalledWith(MOCK_RESPONSE.role, MOCK_RESPONSE.refreshTokenExpiresAt);
  });

  it("next 파라미터 없으면 /home으로 리다이렉트한다", async () => {
    mockSignin.mockResolvedValue(MOCK_RESPONSE);
    const result = await handleSigninFormSubmit(
      INITIAL_STATE,
      makeFormData({ phoneNumber: "01012345678", password: "pass1234" }),
    );
    expect(result.shouldRedirect).toBe(true);
    expect(result.redirectTo).toBe("/home");
  });

  it("올바른 next 파라미터가 있으면 해당 경로로 리다이렉트한다", async () => {
    mockSignin.mockResolvedValue(MOCK_RESPONSE);
    setLocationSearch("?next=/vote");
    const result = await handleSigninFormSubmit(
      INITIAL_STATE,
      makeFormData({ phoneNumber: "01012345678", password: "pass1234" }),
    );
    expect(result.redirectTo).toBe("/vote");
  });

  it("오픈 리다이렉트 방지: next가 /signin이면 /home으로 리다이렉트한다", async () => {
    mockSignin.mockResolvedValue(MOCK_RESPONSE);
    setLocationSearch("?next=/signin");
    const result = await handleSigninFormSubmit(
      INITIAL_STATE,
      makeFormData({ phoneNumber: "01012345678", password: "pass1234" }),
    );
    expect(result.redirectTo).toBe("/home");
  });

  it("오픈 리다이렉트 방지: next가 외부 URL이면 /home으로 리다이렉트한다", async () => {
    mockSignin.mockResolvedValue(MOCK_RESPONSE);
    setLocationSearch("?next=https://evil.com");
    const result = await handleSigninFormSubmit(
      INITIAL_STATE,
      makeFormData({ phoneNumber: "01012345678", password: "pass1234" }),
    );
    expect(result.redirectTo).toBe("/home");
  });
});

describe("handleSigninFormSubmit - 로그인 실패", () => {
  it("API 오류 시 isValid: false와 에러 메시지를 반환한다", async () => {
    mockSignin.mockRejectedValue(new Error("아이디 또는 비밀번호가 올바르지 않습니다."));
    const result = await handleSigninFormSubmit(
      INITIAL_STATE,
      makeFormData({ phoneNumber: "01012345678", password: "pass1234" }),
    );
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("아이디 또는 비밀번호가 올바르지 않습니다.");
  });
});
