import { describe, it, expect, vi, beforeEach } from "vitest";
import { handlePerformerVerifySubmit } from "../handlePerformerVerifySubmit";

vi.mock("@/entities/user/api/verifyPerformer", () => ({ verifyPerformer: vi.fn() }));
vi.mock("@/shared/utils/auth", () => ({ setTokens: vi.fn(), setRole: vi.fn() }));

import { verifyPerformer } from "@/entities/user/api/verifyPerformer";
import { setTokens, setRole } from "@/shared/utils/auth";

const mockVerifyPerformer = vi.mocked(verifyPerformer);
const mockSetTokens = vi.mocked(setTokens);
const mockSetRole = vi.mocked(setRole);

const MOCK_RESPONSE = {
  accessToken: "access-abc",
  accessTokenExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  refreshToken: "refresh-xyz",
  refreshTokenExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  role: "PERFORMER" as const,
};

const INITIAL_STATE = { values: {}, isValid: false, submitted: false };

function makeFormData(data: Record<string, string>) {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.append(k, v));
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("handlePerformerVerifySubmit - 유효성 검사", () => {
  it("이름이 비어있으면 API를 호출하지 않는다", async () => {
    const result = await handlePerformerVerifySubmit(
      INITIAL_STATE,
      makeFormData({ name: "", code: "ABC123" }),
    );
    expect(result.isValid).toBe(false);
    expect(result.submitted).toBe(true);
    expect(mockVerifyPerformer).not.toHaveBeenCalled();
  });

  it("소문자로 입력한 인증코드를 대문자로 변환해 요청한다", async () => {
    mockVerifyPerformer.mockResolvedValue(MOCK_RESPONSE);
    await handlePerformerVerifySubmit(
      INITIAL_STATE,
      makeFormData({ name: "홍길동", code: "abc123" }),
    );
    expect(mockVerifyPerformer).toHaveBeenCalledWith({ name: "홍길동", code: "ABC123" });
  });

  it("인증코드가 공백뿐이면 API를 호출하지 않는다", async () => {
    const result = await handlePerformerVerifySubmit(
      INITIAL_STATE,
      makeFormData({ name: "홍길동", code: "   " }),
    );
    expect(result.isValid).toBe(false);
    expect(mockVerifyPerformer).not.toHaveBeenCalled();
  });
});

describe("handlePerformerVerifySubmit - 인증 성공", () => {
  it("토큰을 저장하고 role을 PERFORMER로 갱신한다", async () => {
    mockVerifyPerformer.mockResolvedValue(MOCK_RESPONSE);
    await handlePerformerVerifySubmit(
      INITIAL_STATE,
      makeFormData({ name: "홍길동", code: "ABC123" }),
    );
    expect(mockVerifyPerformer).toHaveBeenCalledWith({ name: "홍길동", code: "ABC123" });
    expect(mockSetTokens).toHaveBeenCalledWith(
      MOCK_RESPONSE.accessToken,
      MOCK_RESPONSE.accessTokenExpiresAt,
      MOCK_RESPONSE.refreshToken,
      MOCK_RESPONSE.refreshTokenExpiresAt,
    );
    expect(mockSetRole).toHaveBeenCalledWith("PERFORMER", MOCK_RESPONSE.refreshTokenExpiresAt);
  });

  it("인증 후 예매 페이지로 리다이렉트한다", async () => {
    mockVerifyPerformer.mockResolvedValue(MOCK_RESPONSE);
    const result = await handlePerformerVerifySubmit(
      INITIAL_STATE,
      makeFormData({ name: "홍길동", code: "ABC123" }),
    );
    expect(result.isValid).toBe(true);
    expect(result.shouldRedirect).toBe(true);
    expect(result.redirectTo).toBe("/booking");
  });
});

describe("handlePerformerVerifySubmit - 인증 실패", () => {
  it("이미 사용된 코드면 에러 메시지를 반환하고 토큰을 저장하지 않는다", async () => {
    mockVerifyPerformer.mockRejectedValue(new Error("이미 사용된 인증코드입니다."));
    const result = await handlePerformerVerifySubmit(
      INITIAL_STATE,
      makeFormData({ name: "홍길동", code: "ABC123" }),
    );
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("이미 사용된 인증코드입니다.");
    expect(mockSetTokens).not.toHaveBeenCalled();
    expect(mockSetRole).not.toHaveBeenCalled();
  });
});
